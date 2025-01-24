import { Transaction } from "@/store";
import { ActionDetails, ActionList } from "./action-list";
import { TransactionList } from "./transaction-list";
import { FieldValues } from "react-hook-form";

export type MainSectionProps<T extends FieldValues> = {
  transactions: Transaction[];
  actionDetails: ActionDetails<T>;
};

export function MainSection<T extends FieldValues>({
  transactions,
  actionDetails,
}: MainSectionProps<T>) {
  return (
    <div className="flex flex-1 p-6 gap-6">
      <div className="flex-1 bg-background rounded-lg p-6 shadow-sm">
        <ActionList actionDetails={actionDetails} />
      </div>
      <div className="flex-1 bg-background rounded-lg border p-6 shadow-sm">
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
