import { Repeat } from "lucide-react";
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

interface Recurrence {
  label: string;
  value: CreateTaskData["recurrence"];
}

export function TaskRecurrence({
  control,
}: {
  control: Control<CreateTaskData>;
}) {
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

  return (
    <Controller
      control={control}
      defaultValue={recurrences[0].value}
      name="recurrence"
      render={({ field }) => {
        const selectedRecurrence = recurrences.find(
          (rec) => rec.value === field.value
        );

        return (
          <Select onValueChange={field.onChange} value={field.value}>
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
                      rec.value === field.value && "bg-accent text-primary"
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
      }}
    />
  );
}
