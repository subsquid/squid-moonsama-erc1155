import {SubstrateExtrinsic,} from '@subsquid/substrate-processor';
import {CONTRACT_ADDRESS, CONTRACT_INSTANCE,} from '../constants';
import {Contract, Owner, Token, TokenOwner, Transfer,} from '../model';
import {get, getOrFail} from './store_helpers';
import {fetchEvmHashFromEvent} from './api';
import {EvmLogHandlerContext, Store} from "@subsquid/substrate-evm-processor";

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
 * @param store
 * @param contractInstance
 * @return {Token}
 */
export async function initializeToken(
    id: number,
    store: Store,
    contractInstance: Contract
): Promise<Token> {
    if (!contractInstance) {
        contractInstance = await getOrFail(store, Contract, CONTRACT_ADDRESS);
    }
    const tokenUri = await CONTRACT_INSTANCE.tokenURI(id);
    return new Token({
        id: `${id}`,
        uri: tokenUri.toString(),
        contract: contractInstance,
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
export async function contractLogsHandler({
                                              topics,
                                              data,
                                              txHash,
                                              contractAddress,
                                              substrate: {_chain, event, block, extrinsic},
                                              store,
                                              parsedLogs
                                          }: EvmLogHandlerContext, contractInstance: Contract): Promise<void> {
    if (!parsedLogs) {
        // No relevant topics found
        return;
    }
    switch (parsedLogs.name) {
        case 'TransferSingle':
            await handleTransfer(
                {
                    topics,
                    data,
                    txHash,
                    contractAddress,
                    substrate: {_chain, event, block, extrinsic},
                    store,
                    parsedLogs
                },
                contractInstance
            );

            break;
        case 'TransferBatch':
            await handleTransferBatch(
                {
                    topics,
                    data,
                    txHash,
                    contractAddress,
                    substrate: {_chain, event, block, extrinsic},
                    store,
                    parsedLogs,
                },
                contractInstance
            );

            break;
        default:
            console.log('Skipping Event: ', parsedLogs.name);
        // process.exit(0)
    }
}

export async function handleTransfer(
    {
        topics,
        data,
        txHash,
        contractAddress,
        substrate: {_chain, event, block, extrinsic},
        store,
        parsedLogs
    }: EvmLogHandlerContext,
    contractInstance: Contract,
): Promise<void> {
    let {from, to, id, operator, value} = parsedLogs?.args;
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
        token = await initializeToken(id.toNumber(), store, contractInstance);
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
    {
        topics,
        data,
        txHash,
        contractAddress,
        substrate: {_chain, event, block, extrinsic},
        store,
        parsedLogs
    }: EvmLogHandlerContext,
    contractInstance: Contract,
): Promise<void> {
    let {from, to, ids, values} = parsedLogs?.args;
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

        if (!token) {
            token = await initializeToken(tokenIdString, store, contractInstance);
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
