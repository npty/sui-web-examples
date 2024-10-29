import { Transaction } from "@/store";
import { Action, ActionList } from "./action-list";
import { TransactionList } from "./transaction-list";

export type MainSectionProps = {
  transactions: Transaction[];
  actions: Action[];
};

export function MainSection({ transactions, actions }: MainSectionProps) {
  return (
    <div className="flex flex-1 p-4">
      <ActionList className="flex-1 mr-4" actions={actions} />
      <TransactionList className="flex-1" transactions={transactions} />
    </div>
  );
}
