import type { Control } from "react-hook-form";
import {
  type Category,
  TaskCategories,
} from "@/components/home/task-properties/task-categories";
import { TaskDueDate } from "@/components/home/task-properties/task-due-date";
import { TaskRecurrence } from "@/components/home/task-properties/task-recurrence";
import type { CreateTaskData } from "@/lib/validation/task";

export default function TaskProperties({
  control,
  categories,
}: {
  control: Control<CreateTaskData>;
  categories: Category[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <TaskDueDate control={control} />

      <TaskCategories categories={categories} control={control} />

      <TaskRecurrence control={control} />
    </div>
  );
}
