import {ethers} from "ethers";
import {Interface} from "ethers/lib/utils"
import ABI from './abis/ERC1155.json'

export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

// API constants
export const INDEXER = process.env.INDEXER_ENDPOINT_URL
export const API_RETRIES = 5;

// From contract
export const CONTRACT_NAME = 'Moonsama'
export const CONTRACT_SYMBOL = 'MSAMA'
export const CONTRACT_TOTAL_SUPPLY = 1000

// ethers contract
export const DUMMY_PRIVATE_KEY = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
export const PROVIDER = new ethers.providers.WebSocketProvider(process.env.CHAIN_NODE || '');
export const WALLET = new ethers.Wallet(DUMMY_PRIVATE_KEY, PROVIDER);
export const CONTRACT_INSTANCE = new ethers.Contract(CONTRACT_ADDRESS, ABI, WALLET);

export  const CONTRACT_INTERFACE = new Interface(ABI);