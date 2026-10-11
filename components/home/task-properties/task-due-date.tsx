import { Calendar } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CreateTaskData } from "@/lib/validation/task";

interface DueDate {
  label: string;
  value: CreateTaskData["dueAt"];
}

export function TaskDueDate({ control }: { control: Control<CreateTaskData> }) {
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
      label: "پس فردا",
      value: "AFTER_TOMORROW",
    },
  ];

  return (
    <Controller
      control={control}
      defaultValue={dueDates[0].value}
      name="dueAt"
      render={({ field }) => {
        const selectedDue = dueDates.find(
          (dueDate) => dueDate.value === field.value
        );

        return (
          <Select onValueChange={field.onChange} value={field.value}>
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
                      dueDate.value === field.value && "bg-accent text-primary"
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
      }}
    />
  );
}
