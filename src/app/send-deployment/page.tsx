"use client";
import { MainSection } from "@/components/main-section";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { useAppStore } from "@/store";
import { getDeployTokenTx } from "@/transactions/deploy-token";
import { getRegisterTokenTx } from "@/transactions/register-token";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useStep } from "usehooks-ts";

const transactionType = "send-deployment";

export default function SendDeployment() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [currentStep, helpers] = useStep(3);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const transactions = useAppStore((state) => state.transactions);
  const chainConfig = useChainConfig();

  const { signAndExecute } = useSuiTransaction();

  const actions = [
    { name: "Deploy Token", onClick: handleDeployToken },
    { name: "Register Token", onClick: handleRegisterToken },
    {
      name: "Send Token Deployment",
      onClick: () => console.log("Action 2 clicked"),
    },
  ];

  async function handleRegisterToken() {
    if (!account) return;
    if (!chainConfig) return;

    const transaction = await getRegisterTokenTx(
      suiClient,
      account.address,
      chainConfig,
      "TT",
      transactions,
    );

    if (!transaction) return;

    signAndExecute(transaction, {
      onSuccess: updateTransaction,
    });
  }

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
      label: actions[currentStep - 1].name,
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
