import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SendDeploymentDetails } from "@/features/types";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { useAppStore } from "@/store";
import { getDeployTokenTx } from "@/transactions/deploy-token";
import { getRegisterTokenTx } from "@/transactions/register-token";
import { getSendTokenDeploymentTx } from "@/transactions/send-token-deployment";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

export type UseTokenDeploymentProps = {
  onSuccess: (result: SuiTransactionBlockResponse) => void;
};

export const useTokenDeployment = ({ onSuccess }: UseTokenDeploymentProps) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const chainConfig = useChainConfig();
  const { signAndExecute } = useSuiTransaction();
  const transactions = useAppStore((state) => state.transactions);

  const form = useForm<SendDeploymentDetails>({
    defaultValues: {
      tokenName: "Apature",
      tokenSymbol: "APT",
      tokenDecimals: 9,
      destinationChain: "optimism-sepolia",
    },
  });

  const handleDeployToken = async (data: SendDeploymentDetails) => {
    if (!account) return;

    const transaction = await getDeployTokenTx(
      account.address,
      data.tokenName,
      data.tokenSymbol,
      data.tokenDecimals,
    );

    signAndExecute(transaction, {
      onError: (e) => toast.error(`Transaction Failed ${e}`),
      onSuccess,
    });
  };

  const handleRegisterToken = async () => {
    if (!account || !chainConfig) return;
    const tokenSymbol = form.watch("tokenSymbol");

    const transaction = await getRegisterTokenTx(
      suiClient,
      account.address,
      chainConfig,
      tokenSymbol,
      transactions,
    );

    if (!transaction) return;
    signAndExecute(transaction, { onSuccess });
  };

  const handleSendTokenDeployment = async (data: SendDeploymentDetails) => {
    if (!account || !chainConfig) return;

    const transaction = await getSendTokenDeploymentTx(
      suiClient,
      account.address,
      chainConfig,
      data.destinationChain,
      data.tokenSymbol,
      transactions,
    );

    if (!transaction) return;
    signAndExecute(transaction, { onSuccess });
  };

  return {
    form,
    handleDeployToken: form.handleSubmit(handleDeployToken),
    handleRegisterToken: form.handleSubmit(handleRegisterToken),
    handleSendTokenDeployment: form.handleSubmit(handleSendTokenDeployment),
    chainConfig,
  };
};
