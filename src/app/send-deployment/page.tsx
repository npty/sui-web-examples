"use client";
import { MainSection } from "@/components/main-section";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { useAppStore } from "@/store";
import { getDeployTokenTx } from "@/transactions/deploy-token";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useStep } from "usehooks-ts";

const transactionType = "send-deployment";

export default function SendDeployment() {
  const account = useCurrentAccount();
  const [currentStep, helpers] = useStep(3);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const transactions = useAppStore((state) => state.transactions);

  const { signAndExecute } = useSuiTransaction();

  const actions = [
    { name: "Deploy Token", onClick: handleDeployToken },
    { name: "Send Token", onClick: () => console.log("Action 2 clicked") },
  ];

  async function handleDeployToken() {
    if (!account) return;

    const transaction = await getDeployTokenTx(
      account.address,
      "Test Token",
      "TT",
      9,
    );

    signAndExecute(transaction, {
      onSuccess: updateTransaction,
    });
  }

  function updateTransaction(result: SuiTransactionBlockResponse) {
    addTransaction({
      digest: result.digest,
      label: "Deploy Token",
      category: transactionType,
      changesObjects: result.objectChanges ?? [],
    });

    helpers.goToNextStep();
  }

  return (
    <MainSection
      transactions={transactions.filter(
        (tx) => tx.category === transactionType,
      )}
      actions={actions.map((action, index) => ({
        ...action,
        complete: index < currentStep - 1,
      }))}
    />
  );
}
