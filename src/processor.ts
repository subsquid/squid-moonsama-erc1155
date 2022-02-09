import {
    SubstrateExtrinsic, SubstrateProcessor,
} from '@subsquid/substrate-processor';
import {
    CONTRACT_ADDRESS,
    CONTRACT_INSTANCE,
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
} from './constants';
import ABI from './abis/ERC1155.json'
import { eventParser } from './helpers/contract_events';
import {
    Contract,
    Owner,
    Token,
    Transfer,
    TokenOwner,
} from './model';
import { get, getOrFail } from './helpers/store_helpers';
import { fetchEvmHashFromEvent } from './helpers/api';
import {MoonbeamProcessor} from "@subsquid/substrate-evm-processor/lib/moonbeamProcessor";

export interface EVM_LOG {
    data: string;
    topics?: Array<string> | null;
    address: string;
}

export interface ParsedLogs {
    name: string;
    args?: any;
    topics: string;
    fragment: any;
    signature: string;
}


const processor = new MoonbeamProcessor('moonbeam-substrate', ABI)

// to cache contract instance
let contractInstance: Contract;

processor.setTypesBundle('kusama')
processor.setBatchSize(500)


processor.setDataSource({
    archive: 'https://kusama.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://kusama-rpc.polkadot.io'
})

processor.addEventHandler('balances.Transfer', async ctx => {
    let transfer = getTransferEvent(ctx)
    let tip = ctx.extrinsic?.tip || 0n
    let from = ss58.codec('kusama').encode(transfer.from)
    let to = ss58.codec('kusama').encode(transfer.to)

    let fromAcc = await getOrCreate(ctx.store, Account, from)
    fromAcc.balance = fromAcc.balance || 0n
    fromAcc.balance -= transfer.amount
    fromAcc.balance -= tip
    await ctx.store.save(fromAcc)

    const toAcc = await getOrCreate(ctx.store, Account, to)
    toAcc.balance = toAcc.balance || 0n
    toAcc.balance += transfer.amount
    await ctx.store.save(toAcc)

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-to',
        account: fromAcc,
        balance: fromAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-from',
        account: toAcc,
        balance: toAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))
})


processor.run()


interface TransferEvent {
    from: Uint8Array
    to: Uint8Array
    amount: bigint
}


function getTransferEvent(ctx: EventHandlerContext): TransferEvent {
    let event = new BalancesTransferEvent(ctx)
    if (event.isV1020) {
        let [from, to, amount] = event.asV1020
        return {from, to, amount}
    } else if (event.isV1050) {
        let [from, to, amount] = event.asV1050
        return {from, to, amount}
    } else {
        return event.asLatest
    }
}


async function getOrCreate<T extends {id: string}>(
    store: Store,
    entityConstructor: EntityConstructor<T>,
    id: string
): Promise<T> {

    let e = await store.get<T>(entityConstructor, {
        where: { id },
    })

    if (e == null) {
        e = new entityConstructor()
        e.id = id
    }

    return e
}


type EntityConstructor<T> = {
    new (...args: any[]): T
}

/**
 * Initialize new Owner Account
 * @param {string} id
 * @return {Owner}
 */
function initializeOwner(id: string): Owner {
    return new Owner({
        id,
    });
}

/**
 * Initialize new Token
 * @param {string} id
 * @return {Token}
 */
export async function initializeToken(
    id: number,
    store: DatabaseManager,
): Promise<Token> {
    if (!contractInstance) {
        contractInstance = await getOrFail(store, Contract, CONTRACT_ADDRESS);
    }
    const [tokenUri, totalSupply] = await Promise.all([
        CONTRACT_INSTANCE.uri(id),
        CONTRACT_INSTANCE.totalSupply(id),
    ]);
    return new Token({
        id: `${id}`,
        uri: tokenUri.toString(),
        contract: contractInstance,
        totalSupply: totalSupply,
    });
}

/**
 * Initialize Token Owner
 * @param {string} id
 * @param {Owner} owner
 * @param {Token} token
 * @return {TokenOwner}
 */
export function initializeTokenOwner(
    id: string,
    owner: Owner,
    token: Token,
): TokenOwner {
    return new TokenOwner({
        id,
        balance: 0n,
        owner,
        token,
    });
}

// to cache contract instance
let contractInstance: Contract;

export async function initialize({
                                     store,
                                 }: EventContext & StoreContext): Promise<void> {
    console.info('Starting to initialize with defaults');
    let contract = new Contract({
        id: CONTRACT_ADDRESS,
        name: CONTRACT_NAME,
        symbol: CONTRACT_SYMBOL,
    });
    await store.save(contract);
    console.info('Initialization completed');
}

export async function contractLogsHandler({
                                              store,
                                              event,
                                              block,
                                              extrinsic,
                                          }: EventContext & StoreContext): Promise<void> {
    let evmLog: EVM_LOG = event.params[0].value as EVM_LOG;
    let address = evmLog.address;
    let data = evmLog.data;
    let topics = evmLog.topics || [];

    if (address !== CONTRACT_ADDRESS) {
        // Not the address we are looking into
        return;
    }

    let parsedLogs = eventParser(data, topics);

    if (!parsedLogs) {
        // No relevant topics found
        return;
    }
    switch (parsedLogs.name) {
        case 'TransferSingle':
            await handleTransfer(
                {
                    store,
                    event,
                    block,
                    extrinsic,
                },
                parsedLogs as ParsedLogs,
            );

            break;
        case 'TransferBatch':
            await handleTransferBatch(
                {
                    store,
                    event,
                    block,
                    extrinsic,
                },
                parsedLogs as ParsedLogs,
            );

            break;
        default:
            console.log('Skipping Event: ', parsedLogs.name);
        // process.exit(0)
    }
}

export async function handleTransfer(
    { store, event, block, extrinsic }: EventContext & StoreContext,
    parsedLogs: ParsedLogs,
): Promise<void> {
    let { from, to, id, operator, value } = parsedLogs?.args;
    let [previousOwner, newOwner, token] = await Promise.all([
        get(store, Owner, from),
        get(store, Owner, to),
        get(store, Token, id.toNumber()),
    ]);
    let evmHash = await fetchEvmHashFromEvent(
        block,
        extrinsic as SubstrateExtrinsic,
    );

    if (!previousOwner) {
        previousOwner = initializeOwner(from);
        await store.save(previousOwner);
    }

    if (from === to) {
        newOwner = previousOwner;
    }

    if (!newOwner) {
        newOwner = initializeOwner(to);
        await store.save(newOwner);
    }

    if (!token) {
        token = await initializeToken(id.toNumber(), store);
        await store.save(token);
    }

    // sender balance
    let senderTokenOwnerId = from.concat('-').concat(token.id);
    let senderTokenOwner = await get(store, TokenOwner, senderTokenOwnerId);

    if (senderTokenOwner == undefined) {
        senderTokenOwner = initializeTokenOwner(
            senderTokenOwnerId,
            previousOwner,
            token,
        );
    }

    // if we mint tokens, we don't mark it
    // total minted ever can be caluclated by totalSupply + burned amount
    if (previousOwner.id != '0x0000000000000000000000000000000000000000') {
        senderTokenOwner.balance = senderTokenOwner.balance - BigInt(value);
    }

    // recipient balance
    let recipientTokenOwnerId = to.concat('-').concat(token.id);
    let recipientTokenOwner =
        recipientTokenOwnerId === senderTokenOwnerId
            ? senderTokenOwner
            : await get(store, TokenOwner, recipientTokenOwnerId);

    if (recipientTokenOwner == undefined) {
        recipientTokenOwner = initializeTokenOwner(
            recipientTokenOwnerId,
            newOwner,
            token,
        );
    }

    // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
    recipientTokenOwner.balance = recipientTokenOwner.balance + BigInt(value);
    let transfer = new Transfer();
    transfer.token = token;
    transfer.from = from;
    transfer.to = to;
    transfer.timestamp = BigInt(block.timestamp);
    transfer.block = BigInt(block.height);
    transfer.amount = BigInt(value);
    transfer.transactionHash = evmHash || '';

    // Cannot use promise.all to handle case from == to
    await store.save(senderTokenOwner);
    await store.save(recipientTokenOwner);
    await store.save(transfer);
}

export async function handleTransferBatch(
    { store, event, block, extrinsic }: EventContext & StoreContext,
    parsedLogs: ParsedLogs,
): Promise<void> {
    let { from, to, ids, values } = parsedLogs?.args;
    let tokenIds = ids;
    let amounts = values;
    let [previousOwner, newOwner] = await Promise.all([
        get(store, Owner, from),
        get(store, Owner, to),
    ]);
    let evmHash = await fetchEvmHashFromEvent(
        block,
        extrinsic as SubstrateExtrinsic,
    );

    if (!previousOwner) {
        previousOwner = initializeOwner(from);
        await store.save(previousOwner);
    }

    if (from === to) {
        newOwner = previousOwner;
    }

    if (!newOwner) {
        newOwner = initializeOwner(to);
        await store.save(newOwner);
    }

    for (let i = 0; i < tokenIds.length; i++) {
        let tokenId = tokenIds[i];
        let tokenIdString = tokenId.toString();
        let amount = amounts[i];

        let token = await get(store, Token, tokenIdString);
        // let transferId = event.transaction.hash
        //   .toHexString()
        //   .concat('-'.concat(tokenIdString))
        //   .concat('-'.concat(event.transactionLogIndex.toString()));

        if (!token) {
            token = await initializeToken(tokenIdString, store);
            await store.save(token);
        }

        // sender balance
        let senderTokenOwnerId = from.concat('-').concat(token.id);
        let senderTokenOwner = await get(store, TokenOwner, senderTokenOwnerId);

        if (!senderTokenOwner) {
            senderTokenOwner = initializeTokenOwner(
                senderTokenOwnerId,
                previousOwner,
                token,
            );
        }

        // if we mint tokens, we don't mark it
        // total minted ever can be caluclated by totalSupply + burned amount
        if (previousOwner.id != '0x0000000000000000000000000000000000000000') {
            senderTokenOwner.balance = senderTokenOwner.balance - BigInt(amount);
        }

        // recipient balance
        let recipientTokenOwnerId = to.concat('-').concat(token.id);
        let recipientTokenOwner =
            recipientTokenOwnerId === senderTokenOwnerId
                ? senderTokenOwner
                : await get(store, TokenOwner, recipientTokenOwnerId);

        if (!recipientTokenOwner) {
            recipientTokenOwner = initializeTokenOwner(
                recipientTokenOwnerId,
                newOwner,
                token,
            );
        }

        // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
        recipientTokenOwner.balance = recipientTokenOwner.balance + BigInt(amount);

        let transfer = new Transfer();
        transfer.token = token;
        transfer.from = from;
        transfer.to = to;
        transfer.timestamp = BigInt(block.timestamp);
        transfer.block = BigInt(block.height);
        transfer.amount = BigInt(amount);
        transfer.transactionHash = evmHash || '';

        await store.save(senderTokenOwner);
        await store.save(recipientTokenOwner);
        await store.save(transfer);
    }
}