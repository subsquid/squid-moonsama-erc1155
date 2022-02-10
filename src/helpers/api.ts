import { PROVIDER, INDEXER, API_RETRIES } from '../constants';
import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { SubstrateBlock, SubstrateExtrinsic } from '@subsquid/substrate-processor';
import { ethereumExecutedEventsMapper } from './contract_events';

axiosRetry(axios, {
  retries: API_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
});

export interface EthereumExecutedEvent {
  params?: ParamsEntity[] | null;
  id: string;
  name: string;
}

export interface ParamsEntity {
  name: string;
  type: string;
  value: string | Value;
}
export interface Value {
  succeed: string;
}

export const axiosPOSTRequest = async (data: any, indexer = INDEXER) => {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: indexer,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

let EVM_HASH_CACHE: Map<string,string> = new Map()
let lastProcessedBlock = -1

/**
 * Fetch evm tx hash from a ethereum.Executed Event
 * @param {SubstrateBlock} block ethereum block
 * @param { SubstrateExtrinsic} extrinsic
 * @returns {string} ethereum tc hash
 */
export const fetchEvmHashFromEvent = async (
  block : SubstrateBlock,
  extrinsic: SubstrateExtrinsic
) => {

  const eventId = ethereumExecutedEventsMapper(
    block,
    extrinsic
  )
  if(lastProcessedBlock != block.height){
    EVM_HASH_CACHE = new Map()
    lastProcessedBlock = block.height
  }

  if(EVM_HASH_CACHE.has(eventId || '')){
    return EVM_HASH_CACHE.get(eventId || '')
  }
  // please be cautions when modifying query, extra spaces line endings could cause query not to work
  const query = `query MyQuery {
  substrate_event(where: {id: {_eq: "${eventId}"}}) {
    id
    name
    params
  }
}
`;

  let data = JSON.stringify({
    query,
    variables: {},
  });

  let evmHash: string = await axiosPOSTRequest(data).then(
    (data) => data?.data?.substrate_event[0]?.params[2]?.value || '',
  );
  EVM_HASH_CACHE.set(eventId || '', evmHash)
  return evmHash || '';
};
