"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const qoutes = [
  "هرکی می‌گه نمی‌شه زر می‌زنه",
  "هرکی می‌گه نمی‌شه نمی‌تونه",
  "تو انجامش بده",
  "کودن‌تر از تو هم تونسته!",
  "بهونه‌هات هیچ اهمیتی ندارن",
  "بلند شو، انجامش بده",
  "فقط شروع کن",
  "سخته؟ خب که چی؟",
  "تو فقط داری تنبلی می‌کنی",
  "یه قدم دیگه",
  "تمومش کن",
  "ولش نکن",
  "هنوز تموم نشده",
  "قرار نیست راحت باشه",
  "کمتر فکر کن، بیشتر انجام بده",
  "خودت گفتی انجامش می‌دی",
  "منتظر انگیزه نباش",
  "قرار نیست همیشه حسش باشه",
  "بعداً یعنی هیچ‌وقت",
  "به خودت قول دادی",
  "حرف کافیه، عمل کن",
  "هیچ‌کس به جات انجامش نمی‌ده",
];

export default function Greetings({ tasksLength }: { tasksLength: number }) {
  const [selectedQoute, setSelectedQoute] = useState("");

  useEffect(() => {
    const qouteIndex = Math.floor(Math.random() * qoutes.length);

    setSelectedQoute(qoutes[qouteIndex]);
  }, []);

  return (
    <div className="mx-auto flex items-start justify-between rounded-lg bg-accent p-3">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">{"وقتت بخیر دوست عزیز"}</h2>

        {tasksLength > 0 ? (
          <p className="font-bold text-muted-foreground text-xs">
            {`برای امروز ${tasksLength} تا تسک انجام نشده داری`}
          </p>
        ) : (
          <p className="font-bold text-muted-foreground text-xs">
            {"همه تسکای امروزتو انجام دادی!"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {selectedQoute ? (
          <Badge className="bg-primary/10 text-primary">{selectedQoute}</Badge>
        ) : (
          <Skeleton className="h-5 w-16 rounded-3xl bg-primary/10" />
        )}

        {/* 
        <Badge className="mr-auto bg-green-500/10 text-green-600">
          <span>{"1/4"}</span>
          <Flame />
        </Badge> */}
      </div>
    </div>
  );
}
