import {SubstrateExtrinsic,} from '@subsquid/substrate-processor';
import {CONTRACT_ADDRESS, CONTRACT_INSTANCE, getContractEntity} from '../constants';
import {Contract, Owner, Token, Transfer,} from '../model';
import {get, getOrFail} from './store_helpers';
import {fetchEvmHashFromEvent} from './api';
import {EvmLogHandlerContext, Store} from "@subsquid/substrate-evm-processor";
import * as erc1155 from "../abis/erc1155"

// to cache contract instance
export async function contractLogsHandler(ctx: EvmLogHandlerContext): Promise<void> {

    switch (ctx.data) {
        case 'TransferSingle':
            await handleTransfer(ctx);

            break;
        case 'TransferBatch':
            await handleTransferBatch(ctx);

            break;
        default:
            console.log('Skipping Event: ', ctx.data);
        // process.exit(0)
    }
}

export async function handleTransfer(ctx: EvmLogHandlerContext): Promise<void> {
    let {
        topics,
        data,
        txHash,
        contractAddress,
        substrate: {_chain, event, block, extrinsic},
        store
    } = ctx
    let transfer = erc1155.events[erc1155.TRANSFER_SINGLE].decode(ctx)

    let from = await ctx.store.get(Owner, transfer.from)
    if (from == null) {
        from = new Owner({id: transfer.from, balance: 0n})
    }

    let to = await ctx.store.get(Owner, transfer.to)
    if (to == null) {
        to = new Owner({id: transfer.to, balance: 0n})
    }

    let token = await ctx.store.get(Token, transfer.tokenId.toString())
    if (token == null) {
        token = new Token({
            id: transfer.tokenId.toString(),
            uri: await CONTRACT_INSTANCE.tokenURI(transfer.tokenId),
            contract: await getContractEntity(ctx),
            owner: to
        })
        await ctx.store.save(token)
    } else {
        token.owner = to
        await ctx.store.save(token)
    }

    // if we mint tokens, we don't mark it
    // total minted ever can be caluclated by totalSupply + burned amount
    if (from.id != '0x0000000000000000000000000000000000000000') {
        from.balance = from.balance || 0n - BigInt(transfer.value);
    }

    // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
    to.balance = to.balance || 0n + BigInt(transfer.value);

    let transferObj = new Transfer({
        id: ctx.txHash,
        token,
        from,
        to,
        timestamp: BigInt(ctx.substrate.block.timestamp),
        block: BigInt(ctx.substrate.block.height),
        transactionHash: ctx.txHash
    })

    await ctx.store.save(from)
    await ctx.store.save(to)
    await ctx.store.save(transferObj);
}

export async function handleTransferBatch(ctx: EvmLogHandlerContext): Promise<void> {
    let {
        topics,
        data,
        txHash,
        contractAddress,
        substrate: {_chain, event, block, extrinsic},
        store
    } = ctx
    let transfer = erc1155.events[erc1155.TRANSFER_BATCH].decode(ctx)
    
    let from = await ctx.store.get(Owner, transfer.from)
    if (from == null) {
        from = new Owner({id: transfer.from, balance: 0n})
    }

    let to = await ctx.store.get(Owner, transfer.to)
    if (to == null) {
        to = new Owner({id: transfer.to, balance: 0n})
    }


    for (let i = 0; i < transfer.tokenIds.length; i++) {
        let tokenId = transfer.tokenIds[i];
        let value = transfer.values[i];

        let token = await ctx.store.get(Token, tokenId.toString())
        if (token == null) {
            token = new Token({
                id: tokenId.toString(),
                uri: await CONTRACT_INSTANCE.tokenURI(tokenId),
                contract: await getContractEntity(ctx),
                owner: to
            })
            await ctx.store.save(token)
        } else {
            token.owner = to
            await ctx.store.save(token)
        }
        
        // if we mint tokens, we don't mark it
        // total minted ever can be caluclated by totalSupply + burned amount
        if (from.id != '0x0000000000000000000000000000000000000000') {
            from.balance = from.balance || 0n - BigInt(value);
        }

        // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
        to.balance = to.balance || 0n + BigInt(value);
        let transferObj = new Transfer({
            id: ctx.txHash,
            token,
            from,
            to,
            timestamp: BigInt(ctx.substrate.block.timestamp),
            block: BigInt(ctx.substrate.block.height),
            transactionHash: ctx.txHash
        })
    
        await ctx.store.save(from)
        await ctx.store.save(to)
        await ctx.store.save(transferObj);
    }
}
