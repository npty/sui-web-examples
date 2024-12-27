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
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [currentStep, helpers] = useStep(4);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const transactions = useAppStore((state) => state.transactions);
  const chainConfig = useChainConfig();
  const {
    register: registerTokenDetails,
    watch: watchTokenDetails,
    handleSubmit: handleSubmitTokenDeployment,
  } = useForm<SendDeploymentDetails>({
    defaultValues: {
      tokenName: "Apature",
      tokenSymbol: "APT",
      tokenDecimals: 9,
      destinationChain: "optimism-sepolia",
    },
  });

  const { signAndExecute } = useSuiTransaction();

  const actions = [
    {
      name: "Deploy Token",
      onClick: handleSubmitTokenDeployment(handleDeployToken),
      value: registerTokenDetails,
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
      onClick: handleSubmitTokenDeployment(handleSendTokenDeployment),
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

  async function handleRegisterToken() {
    if (!account) return;
    if (!chainConfig) return;

    const tokenSymbol = watchTokenDetails("tokenSymbol");

    const transaction = await getRegisterTokenTx(
      suiClient,
      account.address,
      chainConfig,
      tokenSymbol,
      transactions,
    );

    console.log(transaction);

    if (!transaction) return;

    signAndExecute(transaction, {
      onSuccess: updateTransaction,
    });
  }

  async function handleDeployToken(data: SendDeploymentDetails) {
    if (!account) return;

    const transaction = await getDeployTokenTx(
      account.address,
      data.tokenName,
      data.tokenSymbol,
      data.tokenDecimals,
    );

    signAndExecute(transaction, {
      onError: (e) => toast.error(`Transaction Failed ${e}`),
      onSuccess: updateTransaction,
    });
  }

  async function handleSendTokenDeployment(data: SendDeploymentDetails) {
    if (!account) return;
    if (!chainConfig) return;

    const transaction = await getSendTokenDeploymentTx(
      suiClient,
      account.address,
      chainConfig,
      data.destinationChain,
      data.tokenSymbol,
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
