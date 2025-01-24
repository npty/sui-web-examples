"use client";

import { Action } from "@/components/action";
import { MainSection } from "@/components/main-section";
import { useSendToken } from "@/features/send-token/hooks/useSendToken";
import { SendTokenDetails } from "@/features/send-token/types";
import { useAppStore } from "@/store";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useStep } from "usehooks-ts";

const transactionType = "send-token";

export default function SendToken() {
  const [currentStep, helpers] = useStep(4);
  const { form, handleSendToken, chainConfig } = useSendToken({
    onSuccess: updateTransaction,
  });

  const actions: Action<SendTokenDetails>[] = [
    {
      name: "Send Token",
      onClick: handleSendToken,
      params: [
        {
          label: "Token Id",
          type: "text",
          id: "tokenId",
          placeholder:
            "Enter token id (default to the last token id from Send Deployment page)",
        },
        {
          label: "Treasury Cap",
          type: "text",
          id: "treasuryCap",
          placeholder:
            "Enter treasury cap (default to the last treasury cap from Send Deployment page)",
        },
        {
          label: "Amount",
          type: "number",
          id: "amount",
          placeholder: "Enter amount",
        },
        {
          label: "Destination Chain",
          type: "select",
          id: "destinationChain",
          options: chainConfig?.contracts.ITS.trustedAddresses
            ? Object.keys(chainConfig.contracts.ITS.trustedAddresses).filter(
                (chain) => chain !== "axelar",
              )
            : [],
        },
        {
          label: "Destination Address",
          type: "text",
          id: "destinationAddress",
          placeholder: "Enter destination address",
        },
      ],
    },
  ];

  const { addTransaction, transactions } = useAppStore();

  const pageTransactions = transactions.filter(
    (tx) => tx.category === transactionType,
  );

  useEffect(() => {
    // reset step when navigating back from another page
    helpers.setStep(pageTransactions.length + 1);
  }, [pageTransactions, helpers]);

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
      actionDetails={{
        form,
        actions: actions.map((action, index) => ({
          ...action,
          complete: index < currentStep - 1,
        })),
      }}
    />
  );
}
