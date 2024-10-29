import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export type SignAndExecuteTransactionOptions = {
  onSuccess?: <T>(result: T) => void;
  onError?: <E>(error: E) => void;
};

export function useSuiTransaction() {
  const client = useSuiClient();
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
          console.log(result);
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
