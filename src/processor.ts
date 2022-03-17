import {CONTRACT_ADDRESS, createContractEntity} from "./constants";
import {contractLogsHandler} from "./helpers/event";
import {assertNotNull, SubstrateEvmProcessor} from "@subsquid/substrate-evm-processor";
import * as erc1155 from './abis/erc1155'
import {moonsamaBundle} from "./definitions/moonbeam";

const processor = new SubstrateEvmProcessor('moonbeam-substrate')

processor.setTypesBundle(moonsamaBundle)

const batchSize = parseInt(process.env.BATCH_SIZE || '');
processor.setBatchSize(Number.isInteger(batchSize) ? batchSize : 500)

processor.setDataSource({
    chain: assertNotNull(process.env.CHAIN_NODE),
    archive: assertNotNull(process.env.ARCHIVE)
})

processor.addPreHook({range: {from: 0, to: 0}}, async ctx => {
    await ctx.store.save(createContractEntity())
})

const fromBlock = parseInt(process.env.FROM_BLOCK || '');

processor.addEvmLogHandler(
    CONTRACT_ADDRESS, 
    {
        filter: [
            erc1155.events[erc1155.TRANSFER_BATCH].topic, 
            erc1155.events[erc1155.TRANSFER_SINGLE].topic,
        ],
        range: {from: fromBlock}
    }, 
    contractLogsHandler
)


processor.run()
