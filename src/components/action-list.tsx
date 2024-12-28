"use client";

import { ListTodo } from "lucide-react";
import { Action } from "./action";
import { FieldValues } from "react-hook-form";

export type ActionListProps<T extends FieldValues> = {
  className?: string;
  actions: Action<T>[];
};

export function ActionList<T extends FieldValues>({
  className,
  actions,
}: ActionListProps<T>) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ListTodo className="w-5 h-5 mr-2" />
        Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <Action key={index} action={action} index={index} />
        ))}
      </div>
    </section>
  );
}
