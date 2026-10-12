import { getAllCategories } from "@/app/actions/category";
import { getUserTasks } from "@/app/actions/task";
import AllTasks from "@/components/home/all-tasks";
import TaskBaker from "@/components/home/task-baker";

export default async function AllTasksPage() {
  const allTasks = await getUserTasks();

  const allCategories = await getAllCategories();

  const categories = Array.isArray(allCategories) ? allCategories : [];

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <TaskBaker />

      <div className="flex flex-col gap-3.5">
        <AllTasks categories={categories} tasks={allTasks} />
      </div>
    </div>
  );
}
