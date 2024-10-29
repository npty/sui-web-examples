import { useAppStore } from "@/store";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export type SignAndExecuteTransactionOptions = {
  onSuccess?: (result: SuiTransactionBlockResponse) => void;
  onError?: <E>(error: E) => void;
};

export function useSuiTransaction() {
  const client = useSuiClient();
  const addTransaction = useAppStore((state) => state.addTransaction);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) => {
      const response = await client.executeTransactionBlock({
        signature,
        transactionBlock: bytes,
        options: {
          showObjectChanges: true,
          showEvents: true,
          showEffects: true,
          showRawEffects: true,
        },
      });
      return response;
    },
  });

  const signAndExecute = async (
    tx: Transaction,
    options?: SignAndExecuteTransactionOptions,
  ) => {
    const { onSuccess, onError } = options || {};

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log("Transaction executed successfully", result.digest);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error("Transaction failed", error);
          onError?.(error);
        },
      },
    );
  };

  return { signAndExecute };
}
