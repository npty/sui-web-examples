import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export type SignAndExecuteTransactionOptions = {
  onSuccess?: <T>(result: T) => void;
  onError?: <E>(error: E) => void;
};

export function useSuiTransaction() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

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
          console.log(result.effects);
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
