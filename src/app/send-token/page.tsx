"use client";

import { MainSection } from "@/components/main-section";
import { useAppStore } from "@/store";


const actions = [
  { name: "Send Token", onClick: () => console.log("Action 1 clicked") },
  { name: "Action 2", onClick: () => console.log("Action 2 clicked") },
  { name: "Action 3", onClick: () => console.log("Action 3 clicked") },
];

export default function SendToken() {
  const transactions = useAppStore((state) => state.transactions);

  return <MainSection transactions={transactions.filter((tx) => tx.category === "send-token")} actions={actions} />;
}
