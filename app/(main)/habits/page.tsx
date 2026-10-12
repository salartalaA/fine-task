import { Flame, Plus, Trash2 } from "lucide-react";
import {
  activateRoutineFromForm,
  createRoutineFromForm,
  createSuggestedRoutine,
  deleteRoutineFromForm,
  getRoutines,
} from "@/app/actions/routine";
import HabitsList from "@/components/home/habits-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const habitSuggestions = [
  { emoji: "💧", title: "نوشیدن 500 میلی‌لیتر آب" },
  { emoji: "🚶", title: "15 دقیقه پیاده‌روی در فضای باز" },
  { emoji: "📖", title: "خواندن 20 صفحه" },
  { emoji: "🧹", title: "5 دقیقه مرتب کردن اتاق" },
  { emoji: "💊", title: "مصرف ویتامین‌های روزانه" },
  { emoji: "✍️", title: "نوشتن یک مورد برای قدردانی" },
] as const;

export default async function Habits() {
  const result = await getRoutines();
  const routines = result.success ? result.routines : [];

  const inactiveRoutines = routines.filter((routine) => !routine.isActive);
  const activeRoutines = routines.filter((routine) => routine.isActive);

  const existingTitles = new Set(
    routines.map((routine) => routine.title.toLocaleLowerCase())
  );

  const suggestions = habitSuggestions.filter(
    (habit) => !existingTitles.has(habit.title.toLocaleLowerCase())
  );

  const completedCount = activeRoutines.filter(
    (routine) => routine.isDone
  ).length;

  return (
    <div className="mx-auto my-22 w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex w-fit rounded-sm bg-primary p-3">
            <Flame className="fill-foreground" />
          </span>

          <div>
            <h2 className="font-semibold">{"عادات روزانه"}</h2>
            <p className="font-semibold text-muted-foreground text-xs">
              {
                "هرروز یه سری کارا رو می‌خوای انجام بدی یادت می‌ره؟ اینجا اضافشون کن"
              }
            </p>
          </div>
        </div>

        <Badge className="bg-primary/10 py-3 text-primary text-xs">
          {completedCount}/{activeRoutines.length} تمام شده
        </Badge>
      </div>

      <form action={createRoutineFromForm} className="flex items-center gap-2">
        <Input
          className="rounded-sm border-primary/20 p-4 py-6 text-sm"
          maxLength={80}
          name="title"
          placeholder="عادت جدید (مثلا زود بیدار شدن) ..."
          required
        />

        <Button
          className="rounded-sm bg-primary/10 px-4 py-6 text-primary hover:bg-primary/20"
          type="submit"
        >
          <Plus size={20} />
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        <span className="font-bold text-muted-foreground text-xs">
          {"ایده الهام‌بخش سریع"}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {inactiveRoutines.map((habit) => (
            <div
              className="flex h-auto w-fit items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-medium text-foreground text-xs shadow-2xs transition-colors hover:border-primary/40 hover:bg-primary/10"
              key={habit.id}
            >
              <span>{habit.title}</span>

              <div className="ms-1 flex items-center gap-2">
                <form action={activateRoutineFromForm}>
                  <input name="routineId" type="hidden" value={habit.id} />
                  <Button
                    aria-label={`افزودن ${habit.title}`}
                    className="size-5 p-0 text-primary hover:bg-primary/10"
                    size="icon"
                    type="submit"
                    variant="ghost"
                  >
                    <Plus className="size-3" />
                  </Button>
                </form>

                <form action={deleteRoutineFromForm}>
                  <input name="routineId" type="hidden" value={habit.id} />
                  <Button
                    aria-label={`حذف ${habit.title}`}
                    className="size-5 p-0 text-destructive hover:bg-destructive/10"
                    size="icon"
                    type="submit"
                    variant="ghost"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </form>
              </div>
            </div>
          ))}

          {suggestions.map((habit) => (
            <div
              className="flex h-auto w-fit items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-medium text-foreground text-xs shadow-2xs transition-colors hover:border-primary/40 hover:bg-primary/10"
              key={habit.title}
            >
              <span>{habit.emoji}</span>
              <span>{habit.title}</span>

              <div className="ms-1 flex items-center gap-2">
                <form action={createSuggestedRoutine}>
                  <input name="title" type="hidden" value={habit.title} />
                  <Button
                    aria-label={`افزودن ${habit.title}`}
                    className="size-5 p-0 text-primary hover:bg-primary/10"
                    size="icon"
                    type="submit"
                    variant="ghost"
                  >
                    <Plus className="size-3" />
                  </Button>
                </form>

                <form
                  action={async (formData) => {
                    "use server";
                    const userResult = await getRoutines();
                    if (!userResult.success) {
                      return;
                    }
                    await deleteRoutineFromForm(formData);
                  }}
                >
                  <input name="title" type="hidden" value={habit.title} />
                  <Button
                    aria-label={`حذف پیشنهاد ${habit.title}`}
                    className="size-5 p-0 text-destructive hover:bg-destructive/10"
                    size="icon"
                    type="submit"
                    variant="ghost"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HabitsList habits={activeRoutines} />
    </div>
  );
}
