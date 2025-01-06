"use client";

import { ListTodo } from "lucide-react";
import { Action } from "./action";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type ActionListProps<T extends FieldValues> = {
  className?: string;
  actionDetails: ActionDetails<T>;
};

export type ActionDetails<T extends FieldValues> = {
  form: UseFormReturn<T>;
  actions: Action<T>[];
};

export function ActionList<T extends FieldValues>({
  className,
  actionDetails,
}: ActionListProps<T>) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ListTodo className="w-5 h-5 mr-2" />
        Actions
      </h2>

      <div className="space-y-4">
        {actionDetails.actions.map((action, index) => (
          <Action
            key={index}
            form={actionDetails.form}
            action={action}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
