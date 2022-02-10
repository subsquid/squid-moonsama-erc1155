import {Contract} from "./model"
import assert from "assert";
import {CONTRACT_ADDRESS, CONTRACT_NAME, CONTRACT_SYMBOL, CONTRACT_TOTAL_SUPPLY} from "./constants";
import {contractLogsHandler} from "./helpers/event";
import {EvmLogHandlerContext, Store} from "@subsquid/substrate-evm-processor";
import {MoonbeamProcessor} from "@subsquid/substrate-evm-processor/lib/moonbeamProcessor";
import {moonsamaBundle} from "./definitions/moonbeam";
import ABI from './abis/ERC1155.json'

// to cache contract instance
let contractInstance: Contract;

const processor = new MoonbeamProcessor('moonbeam-substrate', ABI)

async function initialize(store: Store): Promise<void> {
    console.info('Starting to initialize with defaults');
    let contract = new Contract({
        id: CONTRACT_ADDRESS,
        name: CONTRACT_NAME,
        symbol: CONTRACT_SYMBOL,
    });
    contractInstance = await store.save(contract);
    console.info('Initialization completed');
}

processor.setTypesBundle(moonsamaBundle)

const batchSize = parseInt(process.env.BATCH_SIZE || '');
processor.setBatchSize(Number.isInteger(batchSize) ? batchSize : 500)

processor.setDataSource({
    archive: process.env.INDEXER_ENDPOINT_URL || '',
    chain: process.env.CHAIN_NODE || ''
})

const fromBlock = parseInt(process.env.FROM_BLOCK || '');

processor.addEvmLogHandler(CONTRACT_ADDRESS, {range: {from: fromBlock}}, async (ctx: EvmLogHandlerContext) => {
    assert(ctx.substrate.event.name === 'evm.Log')

    if (!contractInstance) {
        await initialize(ctx.store);
    }

    await contractLogsHandler(ctx, contractInstance)
})


processor.run()
