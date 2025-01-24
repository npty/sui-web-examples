"use client";
import { MainSection } from "@/components/main-section";
import { useAppStore } from "@/store";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { toast } from "react-toastify";
import { useStep } from "usehooks-ts";
// import {
//   AxelarGMPRecoveryAPI,
//   Environment,
// } from "@axelar-network/axelarjs-sdk";
import { useTokenDeployment } from "@/features/send-deployment/hooks/useTokenDeployment";
import { Action } from "@/components/action";
import { SendDeploymentDetails } from "@/features/send-deployment/types";
import { useEffect } from "react";

// const api: AxelarGMPRecoveryAPI = new AxelarGMPRecoveryAPI({
//   environment: Environment.DEVNET,
// });
//
//
const transactionType = "send-deployment";
export default function SendDeployment() {
  const [currentStep, helpers] = useStep(4);
  const {
    form,
    handleRegisterToken,
    handleDeployToken,
    handleSendTokenDeployment,
    chainConfig,
  } = useTokenDeployment({ onSuccess: updateTransaction });
  const { addTransaction, transactions } = useAppStore();
  const pageTransactions = transactions.filter(
    (tx) => tx.category === transactionType,
  );

  const actions: Action<SendDeploymentDetails>[] = [
    {
      name: "Deploy Token",
      onClick: handleDeployToken,
      params: [
        {
          label: "Token Name",
          type: "text",
          id: "tokenName",
          placeholder: "Enter token name",
        },
        {
          label: "Token Symbol",
          type: "text",
          id: "tokenSymbol",
          placeholder: "Enter token symbol",
        },
        {
          label: "Token Decimals",
          type: "number",
          id: "tokenDecimals",
          placeholder: "Enter token decimals",
        },
      ],
    },
    {
      name: "Register Token",
      onClick: handleRegisterToken,
      params: [
        {
          label: "Initial Supply",
          type: "number",
          id: "initialSupply",
          placeholder: "Enter initial supply",
        },
      ],
    },
    {
      name: "Send Token Deployment",
      onClick: handleSendTokenDeployment,
      params: [
        {
          label: "Destination Chain",
          type: "select",
          id: "destinationChain",
          options: chainConfig?.contracts.ITS.trustedAddresses
            ? Object.keys(chainConfig.contracts.ITS.trustedAddresses).filter(
                (chain) => chain !== "axelar",
              )
            : [],
          placeholder: "Select destination chain",
        },
      ],
    },
  ];

  useEffect(() => {
    // reset step when navigating back from another page
    helpers.setStep(pageTransactions.length + 1);
  }, [pageTransactions, helpers]);

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

  function updateTransaction(result: SuiTransactionBlockResponse) {
    toast.success(
      `Transaction at step ${currentStep} is Successful ${result.digest}`,
    );
    console.log("current step", currentStep);
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
      actionDetails={{
        form,
        actions: actions.map((action, index) => ({
          ...action,
          enabled: currentStep > index,
          complete: index < currentStep - 1,
        })),
      }}
    />
  );
}
