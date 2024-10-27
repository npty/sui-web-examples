"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export type Transaction = {
  id: string;
  status: "Completed" | "Pending" | "Failed";
};

export type TransactionProps = {
  className?: string;
  transactions: Transaction[];
};

export function TransactionList({ className, transactions }: TransactionProps) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4">Published Transactions</h2>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div key={index} className="p-4 bg-card rounded-lg shadow">
              <div className="font-mono text-sm">{tx.id}</div>
              <div
                className={`text-sm ${tx.status === "Completed" ? "text-green-500" : tx.status === "Failed" ? "text-red-500" : "text-yellow-500"}`}
              >
                {tx.status}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
