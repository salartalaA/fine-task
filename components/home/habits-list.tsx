import { CircleCheck, Trash2 } from "lucide-react";
import { deactivateRoutineFromForm } from "@/app/actions/routine";

interface Habit {
  id: string;
  isDone: boolean;
  title: string;
}

interface HabitsListProps {
  habits: Habit[];
}

export default function HabitsList({ habits }: HabitsListProps) {
  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <div
          className="flex items-center justify-between rounded-sm border border-primary/10 bg-accent p-3 shadow-xs transition-all hover:border-primary/30"
          key={habit.id}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <CircleCheck
              className={`size-6 shrink-0 rounded-sm ${
                habit.isDone
                  ? "fill-emerald-500 stroke-foreground"
                  : "text-muted-foreground"
              }`}
            />

            <span
              className={`block truncate font-semibold text-sm ${
                habit.isDone
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {habit.title}
            </span>
          </div>

          <form action={deactivateRoutineFromForm}>
            <input name="routineId" type="hidden" value={habit.id} />
            <button
              aria-label={`برگرداندن ${habit.title} به گوگولی‌ها`}
              className="shrink-0"
              type="submit"
            >
              <Trash2 className="size-4.5 stroke-slate-500" />
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
