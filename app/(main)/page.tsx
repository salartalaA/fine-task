import CreateTask from "@/components/home/create-task";
import DailyRoutines from "@/components/home/daily-routines";
import Greetings from "@/components/home/greetings";

export default function Home() {
  return (
    <div className="mx-auto mt-22 w-full max-w-sm space-y-4">
      <Greetings />

      <DailyRoutines />

      <CreateTask />
    </div>
  );
}
