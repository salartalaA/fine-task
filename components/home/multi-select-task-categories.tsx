"use client";

import { Folder } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Category {
  label: string;
  value: string;
}

export function MultiSelectTaskCategories() {
  const [category, setCategory] = useState("INBOX");

  const categories: Category[] = [
    {
      label: "یادداشت‌ها و صندوق ورودی",
      value: "INBOX",
    },
    {
      label: "خانه و کارهای روزمره",
      value: "HOME",
    },
    {
      label: "سلامتی و تندرستی",
      value: "HEALTH",
    },
    {
      label: "مطالعه و رشد",
      value: "LEARNING",
    },
    {
      label: "امور مالی و پرداخت‌ها",
      value: "FINANCES",
    },
    {
      label: "سرگرمی و آخر هفته",
      value: "LEISURE",
    },
  ];

  return (
    <Select
      onValueChange={(value) => setCategory(value as string)}
      value={category}
    >
      <SelectTrigger className="bg-transparent p-0 [&>svg]:hidden">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition-all hover:bg-slate-700"
          type="button"
        >
          <Folder className="h-4 w-4" />
        </button>
      </SelectTrigger>

      <SelectContent
        className={"mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md"}
      >
        <SelectGroup className={"flex flex-col gap-1"}>
          {categories.map((cat) => (
            <SelectItem
              className={cn(
                "bg-transparent",
                cat.value === category && "bg-accent text-primary"
              )}
              key={cat.value}
              value={cat.value}
            >
              {cat.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
