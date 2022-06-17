import {CHAIN_NODE, contract, createContractEntity} from "./constants";
import { lookupArchive } from "@subsquid/archive-registry";
import {contractLogsHandler} from "./helpers/event";
import {SubstrateEvmProcessor} from "@subsquid/substrate-evm-processor";
import * as erc1155 from './abi/erc1155'

const processor = new SubstrateEvmProcessor('moonbeam-substrate')

processor.setTypesBundle("moonbeam")

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.addPreHook({range: {from: 0, to: 0}}, async ctx => {
    await ctx.store.save(createContractEntity())
})

const fromBlock = parseInt(process.env.FROM_BLOCK || '');

processor.addEvmLogHandler(
    contract.address, 
    {
        filter: [
            erc1155.events["TransferBatch(address,address,address,uint256[],uint256[])"].topic, 
            erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].topic,
        ],
        range: {from: fromBlock}
    }, 
    contractLogsHandler
)


processor.run()
