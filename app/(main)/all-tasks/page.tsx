import AllTasks from "@/components/home/all-tasks";
import TaskBaker from "@/components/home/task-baker";
import { TaskFilter } from "@/components/home/task-filter";

export default function AllTasksPage() {
  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <TaskBaker />

      <div className="flex flex-col gap-3.5">
        <TaskFilter />

        <AllTasks showOtherDues={true} />
      </div>
    </div>
  );
}
