"use client";

import { ListTodo } from "lucide-react";
import { Action } from "./action";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

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
    <section className={cn("space-y-6", className)}>
      <div className="bg-background p-6 rounded-lg border">
        <h2 className="text-xl font-semibold flex items-center">
          <ListTodo className="w-6 h-6 mr-3 text-primary" />
          Action Steps
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Follow these steps to complete the process
        </p>
      </div>

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
