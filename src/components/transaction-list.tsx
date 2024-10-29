"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/store";
import Link from "next/link";

export type TransactionProps = {
  className?: string;
  transactions: Transaction[];
};

const explorerUrl = "https://sui.europarkland.online/txblock";
const customParam = "network=https%3A%2F%2Fsui-node.europarkland.online";

function getExplorerUrl(tx: Transaction) {
  return `${explorerUrl}/${tx.digest}?${customParam}`;
}

export function TransactionList({ className, transactions }: TransactionProps) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4">Published Transactions</h2>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="p-4 items-center flex justify-between bg-card rounded-lg shadow"
            >
              <p className="font-bold">{tx.label}</p>
              <Link
                className={`font-mono text-sm text-green-500`}
                href={getExplorerUrl(tx)}
                target="_blank"
              >
                {tx.digest.slice(0, 8)}...{tx.digest.slice(-8)}
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
