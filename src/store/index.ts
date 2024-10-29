import { SuiObjectChange } from "@mysten/sui/client";
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
  changesObjects: SuiObjectChange[];
};

export type Store = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
};

export const useAppStore = create<Store>((set) => ({
  transactions: [],
  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
  },
}));
