import { SuiEvent, SuiObjectChange } from "@mysten/sui/client";
import { create } from "zustand";

export type TransactionCategory =
  | "send-deployment"
  | "send-token"
  | "receive-token"
  | "receive-deployment";

export type Transaction = {
  digest: string;
  label: string;
  category: TransactionCategory;
  events: SuiEvent[];
  changesObjects: SuiObjectChange[];
};

export type Store = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  chainConfig?: ChainConfig;
  setChainConfig: (chainConfig: ChainConfig) => void;
};

export type ContractObject = {
  address: string;
  objects?: Record<string, string>;
};

export type ITSContractObject = ContractObject & {
  trustedAddresses?: Record<string, string[]>;
};

export type GatewayContractObject = ContractObject & {
  domainSeparator?: string;
  operator?: string;
  minimumRotationDelay?: number;
};

export type ChainContracts = {
  AxelarGateway: GatewayContractObject;
  Utils: ContractObject;
  VersionControl: ContractObject;
  GasService: ContractObject;
  Abi: ContractObject;
  RelayerDiscovery: ContractObject;
  ITS: ITSContractObject;
  Example: ContractObject;
};

export type ChainConfig = {
  name: string;
  axelarId: string;
  networkType: string;
  tokenSymbol: string;
  rpc: string;
  faucetUrl: string;
  contracts: ChainContracts;
};

export const useAppStore = create<Store>((set) => ({
  transactions: [],
  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
  },
  chainConfig: undefined,
  setChainConfig: (chainConfig: ChainConfig) => {
    set(() => ({
      chainConfig,
    }));
  },
}));
