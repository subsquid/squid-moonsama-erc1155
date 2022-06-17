import {
  contract,
  getContractEntity,
} from "../constants";
import { Owner, Token, Transfer } from "../model";
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as erc1155 from "../abi/erc1155";

// to cache contract instance
export async function contractLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  switch (ctx.data) {
    case "TransferSingle":
      await handleTransfer(ctx);

      break;
    case "TransferBatch":
      await handleTransferBatch(ctx);

      break;
    default:
      console.log("Skipping Event: ", ctx.data);
    // process.exit(0)
  }
}

export async function handleTransfer(ctx: EvmLogHandlerContext): Promise<void> {
  let {
    topics,
    data,
    txHash,
    contractAddress,
    substrate: { _chain, event, block, extrinsic },
    store,
  } = ctx;
  let transfer = erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
  }

  let token = await ctx.store.get(Token, transfer.id.toString());
  if (token == null) {
    token = new Token({
      id: transfer.id.toString(),
      uri: await contract.tokenURI(transfer.id),
      contract: await getContractEntity(ctx),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }

  // if we mint tokens, we don't mark it
  // total minted ever can be caluclated by totalSupply + burned amount
  if (from.id != "0x0000000000000000000000000000000000000000") {
    from.balance = from.balance || 0n - transfer.value.toBigInt();
  }

  // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
  to.balance = to.balance || 0n + transfer.value.toBigInt();

  let transferObj = new Transfer({
    id: ctx.txHash,
    token,
    from,
    to,
    timestamp: BigInt(ctx.substrate.block.timestamp),
    block: BigInt(ctx.substrate.block.height),
    transactionHash: ctx.txHash,
  });

  await ctx.store.save(from);
  await ctx.store.save(to);
  await ctx.store.save(transferObj);
}

export async function handleTransferBatch(
  ctx: EvmLogHandlerContext
): Promise<void> {
  let {
    topics,
    data,
    txHash,
    contractAddress,
    substrate: { _chain, event, block, extrinsic },
    store,
  } = ctx;
  let transfer = erc1155.events["TransferBatch(address,address,address,uint256[],uint256[])"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
  }

  for (let i = 0; i < transfer.ids.length; i++) {
    let tokenId = transfer.ids[i];
    let value = transfer.values[i];

    let token = await ctx.store.get(Token, tokenId.toString());
    if (token == null) {
      token = new Token({
        id: tokenId.toString(),
        uri: await contract.tokenURI(tokenId),
        contract: await getContractEntity(ctx),
        owner: to,
      });
      await ctx.store.save(token);
    } else {
      token.owner = to;
      await ctx.store.save(token);
    }

    // if we mint tokens, we don't mark it
    // total minted ever can be caluclated by totalSupply + burned amount
    if (from.id != "0x0000000000000000000000000000000000000000") {
      from.balance = from.balance || 0n - value.toBigInt();
    }

    // in case of 0x0000000000000000000000000000000000000000 it's the burned amount
    to.balance = to.balance || 0n + value.toBigInt();
    let transferObj = new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: BigInt(ctx.substrate.block.height),
      transactionHash: ctx.txHash,
    });

    await ctx.store.save(from);
    await ctx.store.save(to);
    await ctx.store.save(transferObj);
  }
}
