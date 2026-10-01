"use client";

import { cn } from "cn";
import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActiveDue = "TODAY" | "TOMORROW" | "NO_DATE";

interface DueDate {
  label: string;
  value: ActiveDue;
}

export function TaskDueDate() {
  const [due, setDue] = useState<ActiveDue>("TODAY");

  const dueDates: DueDate[] = [
    {
      label: "امروز",
      value: "TODAY",
    },
    {
      label: "فردا",
      value: "TOMORROW",
    },
    {
      label: "بدون تاریخ",
      value: "NO_DATE",
    },
  ];

  const selectedDue = dueDates.find((dueDate) => dueDate.value === due);

  return (
    <Select
      // biome-ignore lint/performance/noJsxPropsBind: No performance issue
      onValueChange={(value) => setDue(value as ActiveDue)}
      value={due}
    >
      <SelectTrigger className="w-full max-w-fit bg-primary/10 [&>svg]:text-foreground">
        <Calendar className="text-primary!" />
        <SelectValue>{selectedDue?.label}</SelectValue>
      </SelectTrigger>

      <SelectContent
        className={"mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md"}
      >
        <SelectGroup className={"flex flex-col gap-1"}>
          {dueDates.map((dueDate) => (
            <SelectItem
              className={cn(
                "bg-transparent",
                dueDate.value === due && "bg-accent text-primary"
              )}
              key={dueDate.value}
              value={dueDate.value}
            >
              {dueDate.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
