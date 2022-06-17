import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface ApprovalForAll0Event {
  account: string;
  operator: string;
  approved: boolean;
}

export interface Create0Event {
  _creator: string;
  _account: string;
  _id: ethers.BigNumber;
  _initialSupply: ethers.BigNumber;
  _maxSupply: ethers.BigNumber;
  _fractionalized: boolean;
}

export interface CreatorGaveUpControl0Event {
  id: ethers.BigNumber;
  creator: string;
}

export interface Lock0Event {
  id: ethers.BigNumber;
  supply: ethers.BigNumber;
}

export interface RoleAdminChanged0Event {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}

export interface RoleGranted0Event {
  role: string;
  account: string;
  sender: string;
}

export interface RoleRevoked0Event {
  role: string;
  account: string;
  sender: string;
}

export interface SecondarySaleFee0Event {
  id: ethers.BigNumber;
  recipient: string;
  value: ethers.BigNumber;
}

export interface TransferBatch0Event {
  operator: string;
  from: string;
  to: string;
  ids: Array<ethers.BigNumber>;
  values: Array<ethers.BigNumber>;
}

export interface TransferSingle0Event {
  operator: string;
  from: string;
  to: string;
  id: ethers.BigNumber;
  value: ethers.BigNumber;
}

export interface URI0Event {
  value: string;
  id: ethers.BigNumber;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "ApprovalForAll(address,address,bool)":  {
    topic: abi.getEventTopic("ApprovalForAll(address,address,bool)"),
    decode(data: EvmEvent): ApprovalForAll0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("ApprovalForAll(address,address,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        account: result[0],
        operator: result[1],
        approved: result[2],
      }
    }
  }
  ,
  "Create(address,address,uint256,uint256,uint256,bool)":  {
    topic: abi.getEventTopic("Create(address,address,uint256,uint256,uint256,bool)"),
    decode(data: EvmEvent): Create0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Create(address,address,uint256,uint256,uint256,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        _creator: result[0],
        _account: result[1],
        _id: result[2],
        _initialSupply: result[3],
        _maxSupply: result[4],
        _fractionalized: result[5],
      }
    }
  }
  ,
  "CreatorGaveUpControl(uint256,address)":  {
    topic: abi.getEventTopic("CreatorGaveUpControl(uint256,address)"),
    decode(data: EvmEvent): CreatorGaveUpControl0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("CreatorGaveUpControl(uint256,address)"),
        data.data || "",
        data.topics
      );
      return  {
        id: result[0],
        creator: result[1],
      }
    }
  }
  ,
  "Lock(uint256,uint256)":  {
    topic: abi.getEventTopic("Lock(uint256,uint256)"),
    decode(data: EvmEvent): Lock0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Lock(uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        id: result[0],
        supply: result[1],
      }
    }
  }
  ,
  "RoleAdminChanged(bytes32,bytes32,bytes32)":  {
    topic: abi.getEventTopic("RoleAdminChanged(bytes32,bytes32,bytes32)"),
    decode(data: EvmEvent): RoleAdminChanged0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleAdminChanged(bytes32,bytes32,bytes32)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        previousAdminRole: result[1],
        newAdminRole: result[2],
      }
    }
  }
  ,
  "RoleGranted(bytes32,address,address)":  {
    topic: abi.getEventTopic("RoleGranted(bytes32,address,address)"),
    decode(data: EvmEvent): RoleGranted0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleGranted(bytes32,address,address)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        account: result[1],
        sender: result[2],
      }
    }
  }
  ,
  "RoleRevoked(bytes32,address,address)":  {
    topic: abi.getEventTopic("RoleRevoked(bytes32,address,address)"),
    decode(data: EvmEvent): RoleRevoked0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleRevoked(bytes32,address,address)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        account: result[1],
        sender: result[2],
      }
    }
  }
  ,
  "SecondarySaleFee(uint256,address,uint256)":  {
    topic: abi.getEventTopic("SecondarySaleFee(uint256,address,uint256)"),
    decode(data: EvmEvent): SecondarySaleFee0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("SecondarySaleFee(uint256,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        id: result[0],
        recipient: result[1],
        value: result[2],
      }
    }
  }
  ,
  "TransferBatch(address,address,address,uint256[],uint256[])":  {
    topic: abi.getEventTopic("TransferBatch(address,address,address,uint256[],uint256[])"),
    decode(data: EvmEvent): TransferBatch0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("TransferBatch(address,address,address,uint256[],uint256[])"),
        data.data || "",
        data.topics
      );
      return  {
        operator: result[0],
        from: result[1],
        to: result[2],
        ids: result[3],
        values: result[4],
      }
    }
  }
  ,
  "TransferSingle(address,address,address,uint256,uint256)":  {
    topic: abi.getEventTopic("TransferSingle(address,address,address,uint256,uint256)"),
    decode(data: EvmEvent): TransferSingle0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("TransferSingle(address,address,address,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        operator: result[0],
        from: result[1],
        to: result[2],
        id: result[3],
        value: result[4],
      }
    }
  }
  ,
  "URI(string,uint256)":  {
    topic: abi.getEventTopic("URI(string,uint256)"),
    decode(data: EvmEvent): URI0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("URI(string,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        value: result[0],
        id: result[1],
      }
    }
  }
  ,
}

function getJsonAbi(): any {
  return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "minter",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_contractURI",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_tokenURIPrefix",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_tokenURIPostfix",
          "type": "string"
        },
        {
          "internalType": "enum HasTokenURI.IDMode",
          "name": "_idMode",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_fractionalized",
          "type": "bool"
        }
      ],
      "name": "Create",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "CreatorGaveUpControl",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supply",
          "type": "uint256"
        }
      ],
      "name": "Lock",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "SecondarySaleFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MINTER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "OWNER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VERSION",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "burnBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "cap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_creator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxSupply",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_fractionalized",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "_customUri",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "internalType": "struct HasSecondarySaleFee.Fee",
          "name": "_fee",
          "type": "tuple"
        }
      ],
      "name": "create",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "creatorGiveUpControl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "fractionalized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "idMode",
      "outputs": [
        {
          "internalType": "enum HasTokenURI.IDMode",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isOperator",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isProxy",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "lock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "maxSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "mintBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxyRegistry",
      "outputs": [
        {
          "internalType": "contract ProxyRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_salePrice",
          "type": "uint256"
        }
      ],
      "name": "royaltyInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "royaltyAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "secondarySaleFee",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "internalType": "struct HasSecondarySaleFee.Fee",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "contractURI",
          "type": "string"
        }
      ],
      "name": "setContractURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "internalType": "struct HasSecondarySaleFee.Fee",
          "name": "_fee",
          "type": "tuple"
        }
      ],
      "name": "setSecondarySaleFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newTokenURI",
          "type": "string"
        }
      ],
      "name": "setTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURIPostfix",
          "type": "string"
        }
      ],
      "name": "setTokenURIPostfix",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURIPrefix",
          "type": "string"
        }
      ],
      "name": "setTokenURIPrefix",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "token",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxSupply",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "locked",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenURIPostfix",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenURIPrefix",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "name": "updateProxyRegistryAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "uriScheme",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
