"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { explorerUrl, explorerUrlExt } from "@/constants";
import { Transaction } from "@/store";
import Link from "next/link";

export type TransactionProps = {
  className?: string;
  transactions: Transaction[];
};

function getExplorerUrl(tx: Transaction) {
  if (!explorerUrl) return `https://suiscan.xyz/testnet/tx/${tx.digest}`;
  if (!explorerUrlExt) return `${explorerUrl}/${tx.digest}`;
  return `${explorerUrl}/${tx.digest}?${explorerUrlExt}`;
}

export function TransactionList({ className, transactions }: TransactionProps) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-6">Published Transactions</h2>
      <ScrollArea className="h-[calc(100vh-250px)] pr-4">
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="p-4 flex items-center justify-between bg-card rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="font-medium text-sm">{tx.label}</p>
              </div>
              <Link
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
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
