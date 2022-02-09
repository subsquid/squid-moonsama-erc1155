import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import ABI from './abis/ERC1155.json'

export const CONTRACT_ADDRESS = '0x1974eeaf317ecf792ff307f25a3521c35eecde86';
export const CONTRACT_INTERFACE = new Interface(ABI);

// From contract
export const CONTRACT_NAME = 'Moonsama'
export const CONTRACT_SYMBOL = 'MSAMA'

// API constants
export const INDEXER = process.env.INDEXER_ENDPOINT_URL
export const API_RETRIES = 5;


// ethers contract
export const DUMMY_PRIVATE_KEY = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
export const PROVIDER = new ethers.providers.WebSocketProvider(process.env.CHAIN_NODE || '');
export const WALLET = new ethers.Wallet(DUMMY_PRIVATE_KEY,PROVIDER);
export const CONTRACT_INSTANCE = new ethers.Contract(CONTRACT_ADDRESS,ABI,WALLET);

