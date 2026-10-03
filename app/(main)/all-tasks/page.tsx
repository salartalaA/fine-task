import AllTasks from "@/components/home/all-tasks";
import CreateTask from "@/components/home/create-task";
import { TaskFilter } from "@/components/home/task-filter";

export default function AllTasksPage() {
  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <CreateTask />

      <div className="flex flex-col gap-3.5">
        <TaskFilter />

        <AllTasks showOtherDues={true} />
      </div>
    </div>
  );
}
