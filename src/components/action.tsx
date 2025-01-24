/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { StampOverlay } from "./ui/stamp-overlay";
import { useEffect, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

export type ActionParam<T extends Record<string, any>> = {
  label: string;
  type: "text" | "number" | "select";
  id: Path<T>;
  options?: string[];
  placeholder?: string;
  max?: string;
  min?: string;
};

export type Action<T extends FieldValues> = {
  name: string;
  onClick: () => void;
  params?: ActionParam<T>[];
  complete?: boolean;
  enabled?: boolean;
};

export type ActionProps<T extends FieldValues> = {
  className?: string;
  index: number;
  form: UseFormReturn<T>;
  action: Action<T>;
};

export function Action<T extends FieldValues>({
  action,
  form,
  index,
}: ActionProps<T>) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (action.complete) {
      setIsOpen(false);
    }
  }, [action.complete]);

  function renderActionParams(param: ActionParam<T>, completed: boolean) {
    const { register, control } = form;
    switch (param.type) {
      case "text":
        return (
          <Input
            id={param.id}
            placeholder={param.placeholder}
            disabled={completed}
            {...register?.(param.id)}
          />
        );
      case "number":
        return (
          <Input
            id={param.id}
            type={param.type}
            placeholder={param.placeholder}
            min={param.min}
            max={param.max}
            disabled={completed}
            {...register?.(param.id)}
          />
        );
      case "select":
        return (
          <Controller
            name={param.id}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                disabled={completed}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={param.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {param.options?.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Card key={index} className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {index + 1}. {action.name}
        </CardTitle>
        {action.params && (
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle token configuration</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {isOpen && (
          <div className="space-y-4">
            {action.params?.map((param, index) => (
              <div key={index} className="space-y2">
                <Label
                  htmlFor={param.id}
                  className={cn({
                    "text-primary font-bold": true,
                    "opacity-50": action.complete,
                  })}
                >
                  {param.label}
                </Label>
                {renderActionParams(param, action.complete || false)}
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={action.onClick}
          className="flex-1"
          disabled={!!action.complete || !action.enabled}
        >
          Execute
        </Button>
      </CardContent>
      <StampOverlay isActive={action.complete} />
    </Card>
  );
}
