"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/store";

export type TransactionProps = {
  className?: string;
  transactions: Transaction[];
};

const explorerUrl = "https://sui.europarkland.online/txblock";
const customParam = "network=https%3A%2F%2Fsui-node.europarkland.online";

function getExplorerUrl(tx: Transaction) {
  return `${explorerUrl}?tx=${tx.digest}?${customParam}`;
}

export function TransactionList({ className, transactions }: TransactionProps) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4">Published Transactions</h2>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div key={index} className="p-4 bg-card rounded-lg shadow">
              <div className="font-mono text-sm">{tx.digest}</div>
              <div className={`text-green-500"`}>{getExplorerUrl(tx)}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
