"use client";

import { Button } from "@/components/ui/button";
import { ListTodo, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StampOverlay } from "./ui/stamp-overlay";

export type Action = {
  name: string;
  onClick: () => void;
  complete?: boolean;
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
          <div className="flex gap-4 items-center" key={index}>
            {action.complete ? (
              <CheckCircle className="w-8 h-8 flex font-bold text-green-500 rounded-full bg-gray-100 border-blue-500 text-center justify-center items-center" />
            ) : (
              <p className="w-8 h-8 flex font-bold text-black rounded-full bg-gray-100 border-blue-500 text-center justify-center items-center">
                {index + 1}
              </p>
            )}

            <div className="relative flex items-center flex-1 justify-between p-4 bg-card rounded-lg shadow">
              <p
                className={cn({
                  "text-primary font-bold": true,
                  "opacity-50": action.complete,
                })}
              >
                {action.name}
              </p>
              <Button onClick={action.onClick} disabled={!!action.complete}>
                Execute
              </Button>
              <StampOverlay isActive={action.complete} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
