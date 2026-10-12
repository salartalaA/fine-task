import { getAllCategories } from "@/app/actions/category";
import { getUserTasks } from "@/app/actions/task";
import CompletedTasks from "@/components/home/completed-tasks";
import TaskBaker from "@/components/home/task-baker";

export default async function LogBook() {
  const allTasks = await getUserTasks();

  const completedTasks = allTasks.filter((task) => task.isDone);

  const allCategories = await getAllCategories();

  const categories = Array.isArray(allCategories) ? allCategories : [];

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <TaskBaker />

      <CompletedTasks categories={categories} tasks={completedTasks} />
    </div>
  );
}
