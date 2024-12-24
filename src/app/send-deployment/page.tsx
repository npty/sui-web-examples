"use client";
import { MainSection } from "@/components/main-section";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { useAppStore } from "@/store";
import { getDeployTokenTx } from "@/transactions/deploy-token";
import { getRegisterTokenTx } from "@/transactions/register-token";
import { getSendTokenDeploymentTx } from "@/transactions/send-token-deployment";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { toast } from "react-toastify";
import { useStep } from "usehooks-ts";
import {
  AxelarGMPRecoveryAPI,
  Environment,
} from "@axelar-network/axelarjs-sdk";
const transactionType = "send-deployment";

const api: AxelarGMPRecoveryAPI = new AxelarGMPRecoveryAPI({
  environment: Environment.DEVNET,
});

export default function SendDeployment() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [currentStep, helpers] = useStep(4);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const transactions = useAppStore((state) => state.transactions);
  const chainConfig = useChainConfig();

  const { signAndExecute } = useSuiTransaction();

  const actions = [
    { name: "Deploy Token", onClick: handleDeployToken },
    { name: "Register Token", onClick: handleRegisterToken },
    {
      name: "Send Token Deployment",
      onClick: handleSendTokenDeployment,
    },
  ];
  //
  // async function estimateMultihopFees() {
  //   if (!account || !chainConfig) return;
  //
  //   const transaction = await api.addGasToSuiChain({
  //     gasParams: "0x",
  //     messageId: "test-1",
  //     refundAddress: account?.address,
  //     amount: "10000000",
  //   });
  //
  //   console.log(transaction);
  //
  //   signAndExecute(transaction, {
  //     onSuccess: (tx) => console.log("Success", tx),
  //   });
  // }
  //

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

    console.log(transaction);

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
      onError: (e) => toast.error(`Transaction Failed ${e}`),
      onSuccess: updateTransaction,
    });
  }

  async function handleSendTokenDeployment() {
    if (!account) return;
    if (!chainConfig) return;

    const transaction = await getSendTokenDeploymentTx(
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

  function updateTransaction(result: SuiTransactionBlockResponse) {
    toast.success(
      `Transaction at step ${currentStep} is Successful ${result.digest}`,
    );
    addTransaction({
      digest: result.digest,
      label: actions[currentStep - 1].name,
      category: transactionType,
      events: result.events ?? [],
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
