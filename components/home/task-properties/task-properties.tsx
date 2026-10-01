import { TaskCategories } from "@/components/home/task-properties/task-categories";
import { TaskDueDate } from "@/components/home/task-properties/task-due-date";
import { TaskRecurrence } from "@/components/home/task-properties/task-recurrence";

export default function TaskProperties() {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <TaskDueDate />

      <TaskCategories />

      <TaskRecurrence />
    </div>
  );
}
