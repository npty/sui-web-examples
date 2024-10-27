"use client";

import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export type Action = {
  name: string;
};

export type ActionProps = {
  className?: string;
  actions: Action[];
};

export function ActionList({ className, actions }: ActionProps) {
  return (
    <section className={className ?? ""}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ListTodo className="w-5 h-5 mr-2" />
        Actions
      </h2>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-card rounded-lg shadow"
          >
            <span>{action.name}</span>
            <Button>Execute</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
