import { ArrowLeft, Circle, CircleCheck, Flame } from "lucide-react";
import Link from "next/link";
import {
  getRoutines,
  toggleRoutineCompletionFromForm,
} from "@/app/actions/routine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DailyRoutines() {
  const result = await getRoutines();
  const habits = result.success
    ? result.routines.filter((routine) => routine.isActive)
    : [];

  return (
    <div className="space-y-2 rounded-lg bg-accent p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Flame className="fill-destructive text-amber-500" size={20} />
          <h3 className="font-semibold text-sm">{"روتین روزانه"}</h3>
        </div>

        <Link
          className="m-0 flex items-center gap-1 p-0 font-semibold text-primary text-xs"
          href="/habits"
        >
          {"عادات"} <ArrowLeft size={14} />
        </Link>
      </div>

      <div className="flex w-fit flex-col items-start gap-2">
        {habits.map((habit) => (
          <form action={toggleRoutineCompletionFromForm} key={habit.id}>
            <input name="routineId" type="hidden" value={habit.id} />
            <Button
              className={cn(
                "rounded-xl bg-primary/10 px-3 py-1.5 text-foreground/90 text-sm hover:bg-primary/20",
                habit.isDone &&
                  "bg-green-500/10 text-green-600 hover:bg-green-500/10"
              )}
              type="submit"
            >
              {habit.isDone ? (
                <CircleCheck className="size-4 fill-green-500 text-foreground" />
              ) : (
                <Circle className="size-4 text-foreground" />
              )}

              <span>{habit.title}</span>
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
