import { getAllCategories } from "@/app/actions/category";
import { getUserTasks } from "@/app/actions/task";
import AllTasks from "@/components/home/all-tasks";
import DailyRoutines from "@/components/home/daily-routines";
import Greetings from "@/components/home/greetings";
import TaskBaker from "@/components/home/task-baker";

export default async function TodaySection() {
  const allTasks = await getUserTasks();

  const todayTasks = allTasks.filter((task) => task.dueAt === "TODAY");

  const todayUncompletedTasks = todayTasks.filter(
    (task) => task.isDone === false
  );

  const allCategories = await getAllCategories();

  const categories = Array.isArray(allCategories) ? allCategories : [];

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <Greetings tasksLength={todayUncompletedTasks.length} />

      <DailyRoutines />

      <TaskBaker />

      <AllTasks categories={categories} tasks={todayTasks} />
    </div>
  );
}
