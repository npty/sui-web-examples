import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { useAppStore } from "@/store";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { SendTokenDetails } from "../types";
import { getSendTokenTx } from "@/transactions/send-token";
import { useEffect, useState } from "react";
import { getEventDataByEventTypes, getObjectIdsByObjectTypes } from "@/lib/sui";

export type UseTokenDeploymentProps = {
  onSuccess: (result: SuiTransactionBlockResponse) => void;
};

type PartialSendTokenDetails = Partial<SendTokenDetails>;

export const useSendToken = ({ onSuccess }: UseTokenDeploymentProps) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const chainConfig = useChainConfig();
  const [sendTokenDetails, setSendTokenDetails] =
    useState<PartialSendTokenDetails>();
  const { signAndExecute } = useSuiTransaction();
  const transactions = useAppStore((state) => state.transactions);

  const form = useForm<SendTokenDetails>({
    defaultValues: {
      tokenId: sendTokenDetails?.tokenId ?? "",
      treasuryCap: sendTokenDetails?.treasuryCap ?? "",
      amount: "1",
    },
  });

  useEffect(() => {
    if (transactions.length > 0) {
      const transaction = transactions.find(
        (tx) => tx.label === "Deploy Token",
      );

      if (!transaction) return;

      const [treasuryCapId] = getObjectIdsByObjectTypes(
        transaction.changesObjects,
        ["TreasuryCap"],
      );

      console.log("TreasuryCapId", treasuryCapId);
      form.setValue("treasuryCap", treasuryCapId);

      const registerTokenTx = transactions.find(
        (tx) => tx.label === "Register Token",
      );
      if (!registerTokenTx) return;

      const [registerEvent] = getEventDataByEventTypes(registerTokenTx.events, [
        "CoinRegistered",
      ]);
      const tokenId = registerEvent.token_id?.id;
      form.setValue("tokenId", tokenId);

      const deployOtherChainTx = transactions.find(
        (tx) => tx.label === "Send Token Deployment",
      );
      if (!deployOtherChainTx) return;

      const [deploymentEvent] = getEventDataByEventTypes(
        deployOtherChainTx.events,
        ["InterchainTokenDeploymentStarted"],
      );
      const destinationChain = deploymentEvent.destination_chain;
      console.log("Destination chain", destinationChain)
      form.setValue("destinationChain", destinationChain);

      const gas = 2e7;

      setSendTokenDetails({
        tokenId,
        treasuryCap: treasuryCapId,
        destinationChain,
        gas: gas.toString(),
      });
    }
  }, [transactions, form]);

  const handleSendToken = async (data: SendTokenDetails) => {
    if (!account) return;
    if (!chainConfig) return;

    const transaction = await getSendTokenTx(
      suiClient,
      account.address,
      chainConfig,
      data,
      transactions,
    );

    if (!transaction) return;

    signAndExecute(transaction, {
      onError: (e) => toast.error(`Transaction Failed ${e}`),
      onSuccess,
    });
  };

  return {
    form,
    handleSendToken: form.handleSubmit(handleSendToken),
    chainConfig,
  };
};
