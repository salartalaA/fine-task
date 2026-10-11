"use client";

import { ArrowLeft, Circle, CircleCheck, Flame } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Habit {
  id: number;
  title: string;
}

export default function DailyRoutines() {
  const [doneList, setDoneList] = useState<number[]>([]);

  const habits: Habit[] = [
    {
      id: 1,
      title: "نوشیدن ۵۰۰ میلی‌لیتر آب صبح",
    },
    {
      id: 2,
      title: "۱۵ دقیقه پیاده‌روی و نور صبح",
    },
    {
      id: 3,
      title: "خواندن ۲۰ صفحه از کتاب فعلی",
    },
    {
      id: 4,
      title: "۵ دقیقه مرتب کردن میز و آشپزخانه",
    },
  ];

  const handleDone = (doneId: number) => {
    setDoneList((prev) =>
      prev.includes(doneId)
        ? prev.filter((id) => id !== doneId)
        : [...prev, doneId]
    );
  };

  return (
    <div className="space-y-2 rounded-lg bg-accent p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Flame className="fill-destructive text-amber-500" size={20} />
          <h3 className="font-semibold text-sm">{"روتین روزانه"}</h3>
        </div>

        <Link
          className="m-0 flex items-center gap-1 p-0 font-semibold text-primary text-xs"
          href={"/habits"}
        >
          {"عادات"} <ArrowLeft size={14} />
        </Link>
      </div>

      <div className="flex w-fit flex-col items-start gap-2">
        {habits.map((habit) => {
          const selectedItem = doneList.includes(habit.id);

          const Icon = selectedItem ? CircleCheck : Circle;

          return (
            <Button
              className={cn(
                "rounded-xl bg-primary/10 px-3 py-1.5 text-foreground/90 text-sm hover:bg-primary/20",
                selectedItem &&
                  "bg-green-500/10 text-green-600 hover:bg-green/500/10"
              )}
              key={habit.id}
              onClick={() => handleDone(habit.id)}
            >
              <Icon
                className={cn(
                  "flex size-4 items-center justify-center rounded-full text-foreground",
                  selectedItem && "fill-green-500"
                )}
              />

              <span>{habit.title}</span>

              {/* {selectedItem && (
                <div className="flex items-center">
                  <span className="text-amber-500 text-xs">{"1"}</span>

                  <Flame className="size-3 fill-destructive text-amber-500" />
                </div>
              )} */}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
