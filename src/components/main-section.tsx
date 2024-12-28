import { Transaction } from "@/store";
import { ActionList } from "./action-list";
import { TransactionList } from "./transaction-list";
import { Action } from "./action";
import { FieldValues } from "react-hook-form";

export type MainSectionProps<T extends FieldValues> = {
  transactions: Transaction[];
  actions: Action<T>[];
};

export function MainSection<T extends FieldValues>({
  transactions,
  actions,
}: MainSectionProps<T>) {
  return (
    <div className="flex flex-1 p-4">
      <ActionList className="flex-1 mr-4" actions={actions} />
      <TransactionList className="flex-1" transactions={transactions} />
    </div>
  );
}
