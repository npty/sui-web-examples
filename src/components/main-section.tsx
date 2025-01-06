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
    <div className="flex flex-1 p-4">
      <ActionList className="flex-1 mr-4" actionDetails={actionDetails} />
      <TransactionList className="flex-1" transactions={transactions} />
    </div>
  );
}
