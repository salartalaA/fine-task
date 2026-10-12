import { getUserTasks } from "@/app/actions/task";
import AllTasks from "@/components/home/all-tasks";
import DailyRoutines from "@/components/home/daily-routines";
import Greetings from "@/components/home/greetings";
import TaskBaker from "@/components/home/task-baker";

export default async function TodaySection() {
  const allTasks = await getUserTasks();

  const todayTasks = allTasks.filter((task) => task.dueAt === "TODAY");

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <Greetings />

      <DailyRoutines />

      <TaskBaker />

      <AllTasks tasks={todayTasks} />
    </div>
  );
}
