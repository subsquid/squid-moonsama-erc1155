import { assertNotNull, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import * as erc1155 from "./abi/erc1155";
import { Contract } from "./model";

export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

// ethers contract
export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc1155.abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);
 
export function createContractEntity(): Contract {
    return new Contract({
      id: contract.address,
      name: "Moonsama",
      symbol: "MSAMA",
      totalSupply: 1000n,
    });
  }
   
  let contractEntity: Contract | undefined;
   
  export async function getContractEntity({
    store,
  }: {
    store: Store;
  }): Promise<Contract> {
    if (contractEntity == null) {
      contractEntity = await store.get(Contract, contract.address);
    }
    return assertNotNull(contractEntity);
  }
  
