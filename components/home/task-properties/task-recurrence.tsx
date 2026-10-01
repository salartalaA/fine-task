"use client";

import { cn } from "cn";
import { Repeat } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActiveRecurrence = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY";

interface Recurrence {
  label: string;
  value: ActiveRecurrence;
}

export function TaskRecurrence() {
  const [recurrence, setRecurrence] = useState<ActiveRecurrence>("ONE_TIME");

  const recurrences: Recurrence[] = [
    {
      label: "یک بار",
      value: "ONE_TIME",
    },
    {
      label: "روزانه",
      value: "DAILY",
    },
    {
      label: "هفتگی",
      value: "WEEKLY",
    },
    {
      label: "ماهانه",
      value: "MONTHLY",
    },
  ];

  const selectedRecurrence = recurrences.find(
    (rec) => rec.value === recurrence
  );

  return (
    <Select
      // biome-ignore lint/performance/noJsxPropsBind: No performance issue
      onValueChange={(value) => setRecurrence(value as ActiveRecurrence)}
      value={recurrence}
    >
      <SelectTrigger className="w-full max-w-fit bg-primary/10 [&>svg]:text-foreground">
        <Repeat className="text-emerald-500!" />
        <SelectValue>{selectedRecurrence?.label}</SelectValue>
      </SelectTrigger>

      <SelectContent
        className={"mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md"}
      >
        <SelectGroup className={"flex flex-col gap-1"}>
          {recurrences.map((rec) => (
            <SelectItem
              className={cn(
                "bg-transparent",
                rec.value === recurrence && "bg-accent text-primary"
              )}
              key={rec.value}
              value={rec.value}
            >
              {rec.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
