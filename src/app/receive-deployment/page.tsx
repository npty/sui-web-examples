"use client";
import { MainSection } from "@/components/main-section";
import { Transaction } from "@/store";

const transactions: Transaction[] = [];

const actions = [
  { name: "Send Token", onClick: () => console.log("Action 1 clicked") },
  { name: "Action 2", onClick: () => console.log("Action 2 clicked") },
  { name: "Action 3", onClick: () => console.log("Action 3 clicked") },
];

export default function ReceiveDeployment() {
  return <MainSection transactions={transactions} actions={actions} />;
}
