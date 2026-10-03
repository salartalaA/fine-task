import AllTasks from "@/components/home/all-tasks";
import CreateTask from "@/components/home/create-task";
import DailyRoutines from "@/components/home/daily-routines";
import Greetings from "@/components/home/greetings";

export default function TodaySection() {
  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <Greetings />

      <DailyRoutines />

      <CreateTask />

      <AllTasks />
    </div>
  );
}
