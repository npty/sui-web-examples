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
import { useForm } from "react-hook-form";
import { useTokenDeployment } from "@/features/send-deployment/hooks/useTokenDeployment";

const api: AxelarGMPRecoveryAPI = new AxelarGMPRecoveryAPI({
  environment: Environment.DEVNET,
});

type SendDeploymentDetails = {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  destinationChain: string;
};

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
  const actions = [
    {
      name: "Deploy Token",
      onClick: handleDeployToken,
      value: form.register,
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
    { name: "Register Token", onClick: handleRegisterToken },
    {
      name: "Send Token Deployment",
      onClick: handleSendTokenDeployment,
      value: form.register,
      params: [
        {
          label: "Destination Chain",
          type: "select",
          id: "destinationChain",
          options: chainConfig
            ? Object.keys(chainConfig?.contracts?.ITS?.trustedAddresses || {})
            : [],
          placeholder: "Select destination chain",
        },
      ],
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
