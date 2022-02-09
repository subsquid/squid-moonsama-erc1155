import { SubstrateBlock, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { CONTRACT_INTERFACE } from "../../constants";


/**
 * Parse contract events
 * @param {String} data
 * @param {Array<String>} topics
 */
export const eventParser = (
  data: string,
  topics: Array<string>,
) => {
  try{
  const event = CONTRACT_INTERFACE.parseLog({ data, topics });
  return {
    name: event.name,
    args: event.args,
    topics: event.topic,
    fragment : event.eventFragment,
    signature : event.signature
  }
  }catch(err){
    console.log('Not a matching event. Skipping')
    return false
  }
 
};


//Extrinsic ID --> Evm Executed Event ID
let BLOCK_EXTRINSIC_EXEC_EVENT: Map<string, string>
let lastBlockProcessed = 0

/**
 * Ethereum Executed events ID for an extrinsic
 * @description The evm hash for an ethereum transaction would
 * only be emitted in an ethereum executed event. Since currently,
 * we only get ids for the corresponding events from the handlers, we 
 * need to fetch it from the indexer to the args
 * @param block 
 * @param extrinsic 
 */
export const ethereumExecutedEventsMapper= (
  block:SubstrateBlock, extrinsic: SubstrateExtrinsic
  ) => {
   if( lastBlockProcessed !== block.height){
   // clear cache
   BLOCK_EXTRINSIC_EXEC_EVENT = new Map()
   lastBlockProcessed = block.height

   block.events.forEach(event => {
     if(event.name === 'ethereum.Executed'){
      BLOCK_EXTRINSIC_EXEC_EVENT.set(event.extrinsicId, event.id)
     }
   })
  }
   return (BLOCK_EXTRINSIC_EXEC_EVENT.get(extrinsic.id))

}
