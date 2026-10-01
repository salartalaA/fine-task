"use client";

import { cn } from "cn";
import { Folder } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  label: string;
  value: string;
}

export function TaskCategories() {
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

  const selectedCategory = categories.find((cat) => cat.value === category);

  return (
    <Select
      // biome-ignore lint/performance/noJsxPropsBind: No performance issue
      onValueChange={(value) => setCategory(value as string)}
      value={category}
    >
      <SelectTrigger className="w-full max-w-fit bg-primary/10 [&>svg]:text-foreground">
        <Folder className="text-indigo-500!" />
        <SelectValue>{selectedCategory?.label}</SelectValue>
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
