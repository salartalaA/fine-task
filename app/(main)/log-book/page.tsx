import CompletedTasks from "@/components/home/completed-tasks";
import TaskBaker from "@/components/home/task-baker";
import { TaskFilter } from "@/components/home/task-filter";

export default function LogBook() {
  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <TaskBaker />

      <TaskFilter />

      <CompletedTasks />
    </div>
  );
}
