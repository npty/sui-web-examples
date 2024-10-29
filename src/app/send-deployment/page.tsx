"use client";
import { MainSection } from "@/components/main-section";
import { Transaction } from "@/components/transaction-list";
import { useSuiTransaction } from "@/hooks/useSuiTransaction";
import { getDeployTokenTx } from "@/transactions/deploy-token";
import { useCurrentAccount } from "@mysten/dapp-kit";

const transactions: Transaction[] = [];

export default function SendDeployment() {
  const account = useCurrentAccount();
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
    console.log("transaction", transaction);
    signAndExecute(transaction);
  }

  return <MainSection transactions={transactions} actions={actions} />;
}
