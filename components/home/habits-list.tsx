"use client";

import { CircleCheck, Flame, Trash2 } from "lucide-react";

const habits = [
  {
    id: "habit-1",
    streak: 0,
    title: "نوشیدن 500 میلی‌لیتر آب",
  },
  {
    id: "habit-2",
    streak: 14,
    title: "15 دقیقه پیاده‌روی در فضای باز",
  },
  {
    id: "habit-3",
    streak: 0,
    title: "خواندن 20 صفحه از کتاب فعلی",
  },
  {
    id: "habit-4",
    streak: 12,
    title: "5 دقیقه مرتب کردن میز و آشپزخانه",
  },
] as const;

export default function HabitsList() {
  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <div
          className="flex items-center justify-between rounded-sm border border-primary/10 bg-accent p-3 shadow-xs transition-all hover:border-primary/30"
          key={habit.id}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <CircleCheck className="size-6 shrink-0 rounded-sm fill-emerald-500 stroke-foreground" />

            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-muted-foreground text-sm line-through">
                {habit.title}
              </span>

              <span className="mt-1 flex items-center gap-1 font-bold font-mono text-amber-500 text-xs tabular-nums">
                <Flame className="size-3.5 fill-current" />
                <span>
                  {habit.streak} {"روز تداوم"}
                </span>
              </span>
            </div>
          </div>

          <Trash2 className="size-4.5 stroke-slate-500" />
        </div>
      ))}
    </div>
  );
}
