import CompletedTasks from "@/components/home/completed-tasks";
import CreateTask from "@/components/home/create-task";
import { TaskFilter } from "@/components/home/task-filter";

export default function LogBook() {
  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <CreateTask />

      <TaskFilter />

      <CompletedTasks />
    </div>
  );
}
