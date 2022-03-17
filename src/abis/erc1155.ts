import {Interface} from "@ethersproject/abi"
import erc1155Json from "./ERC1155.json"
import {EvmLogHandlerContext} from '@subsquid/substrate-evm-processor'

const abi = new Interface(erc1155Json)

export interface TransferBatchEvent {
    operator: string
    from: string
    to: string
    tokenIds: [bigint]
    values: [bigint]
}

export interface TransferSingleEvent {
    operator: string
    from: string
    to: string
    tokenId: bigint
    value: bigint
}
export const TRANSFER_BATCH : string = 'Transfer(address,address,address,uint256[],uint256[])';
export const TRANSFER_SINGLE : string = 'Transfer(address,address,address,uint256,uint256)';

export const events : any = {
    TRANSFER_BATCH: {
        topic: abi.getEventTopic(TRANSFER_BATCH),
        transfer_fragment : abi.getEvent(TRANSFER_BATCH),
        decode(data: EvmLogHandlerContext): TransferBatchEvent {
            let transfer_fragment = abi.getEvent(TRANSFER_BATCH);
            let result = abi.decodeEventLog(transfer_fragment, data.data || '', data.topics)
            return {
                operator: result[0],
                from: result[1],
                to: result[2],
                tokenIds: result[3].map((n: { toBigInt: () => BigInt }) => n.toBigInt()),
                values: result[4].map((n: { toBigInt: () => BigInt }) => n.toBigInt())
            }
        }
    },
    TRANSFER_SINGLE: {
        topic: abi.getEventTopic(TRANSFER_SINGLE),
        transfer_fragment : abi.getEvent(TRANSFER_SINGLE),
        decode(data: EvmLogHandlerContext): TransferSingleEvent {
            let transfer_fragment = abi.getEvent(TRANSFER_SINGLE);
            let result = abi.decodeEventLog(transfer_fragment, data.data || '', data.topics)
            return {
                operator: result[0],
                from: result[1],
                to: result[2],
                tokenId: result[3].toBigInt(),
                value: result[4].toBigInt()
            }
        }
    }
}
