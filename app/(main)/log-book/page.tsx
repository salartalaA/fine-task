import { getUserTasks } from "@/app/actions/task";
import CompletedTasks from "@/components/home/completed-tasks";
import TaskBaker from "@/components/home/task-baker";
import { TaskFilter } from "@/components/home/task-filter";

export default async function LogBook() {
  const allTasks = await getUserTasks();

  const completedTasks = allTasks.filter((task) => task.isDone);

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <TaskBaker />

      <TaskFilter />

      <CompletedTasks tasks={completedTasks} />
    </div>
  );
}
