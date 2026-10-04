import { Flame, Plus } from "lucide-react";
import HabitsList from "@/components/home/habits-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Habits() {
  const habitSuggestions = [
    {
      emoji: "💧",
      title: "نوشیدن 500 میلی‌لیتر آب",
    },
    {
      emoji: "🚶",
      title: "15 دقیقه پیاده‌روی در فضای باز",
    },
    {
      emoji: "📖",
      title: "خواندن 20 صفحه",
    },
    {
      emoji: "🧹",
      title: "5 دقیقه مرتب کردن اتاق",
    },
    {
      emoji: "💊",
      title: "مصرف ویتامین‌های روزانه",
    },
    {
      emoji: "✍️",
      title: "نوشتن یک مورد برای قدردانی",
    },
  ] as const;

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
              {"روزی یک ضربه برای ایجاد تداومی ملایم و پایدار"}
            </p>
          </div>
        </div>

        <Badge className="bg-primary/10 py-3 text-primary text-xs">
          {"0/4 تمام شده"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Input
          className="rounded-sm border-primary/20 p-4 py-6 text-sm"
          placeholder="عادت جدید (مثلا زود بیدار شدن) ..."
        />

        <Button
          className="rounded-sm bg-primary/10 px-4 py-6 text-primary hover:bg-primary/20"
          type="submit"
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold text-muted-foreground text-xs">
          {"ایده الهام‌بخش سریع"}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {habitSuggestions.map((habit) => (
            <Button
              className="flex h-auto w-fit items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-medium text-foreground text-xs shadow-2xs transition-colors hover:border-primary/40 hover:bg-primary/10"
              key={habit.title}
              size="xs"
              title={`افزودن «${habit.title}»`}
            >
              <span>{habit.emoji}</span>
              <span>{habit.title}</span>
              <Plus className="size-3 text-primary" />
            </Button>
          ))}
        </div>
      </div>

      <HabitsList />
    </div>
  );
}
