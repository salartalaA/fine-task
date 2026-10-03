"use client";

import { ListTodo } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Category {
  label: string;
  value: CategoryValue;
}

interface Recurrence {
  label: string;
  value: RecurrenceValue;
}

interface SortOption {
  label: string;
  value: SortValue;
}

interface SortDirection {
  label: string;
  value: Direction;
}

type CategoryValue =
  | "INBOX"
  | "HOME"
  | "HEALTH"
  | "LEARNING"
  | "FINANCES"
  | "LEISURE";

type RecurrenceValue = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY";

type SortValue = "DUE_DATE" | "TITLE" | "CREATED_AT";

type Direction = "ASC" | "DESC";

export function TaskFilter() {
  const [category, setCategory] = useState<CategoryValue>("INBOX");

  const [recurrence, setRecurrence] = useState<RecurrenceValue>("ONE_TIME");

  const [sortValue, setSortValue] = useState<SortValue>("DUE_DATE");

  const [direction, setDirection] = useState<Direction>("DESC");

  const [filterEnable, setFilterEnable] = useState(false);

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

  const recurrences: Recurrence[] = [
    {
      label: "یک بار",
      value: "ONE_TIME",
    },
    {
      label: "روزانه",
      value: "DAILY",
    },
    {
      label: "هفتگی",
      value: "WEEKLY",
    },
    {
      label: "ماهانه",
      value: "MONTHLY",
    },
  ];

  const sortOptions: SortOption[] = [
    {
      label: "مهلت",
      value: "DUE_DATE",
    },
    {
      label: "حروف الفبا",
      value: "TITLE",
    },
    {
      label: "تاریخ ایجاد",
      value: "CREATED_AT",
    },
  ];

  const sortDirection: SortDirection[] = [
    {
      label: "صعودی",
      value: "ASC",
    },
    {
      label: "نزولی",
      value: "DESC",
    },
  ];

  const selectedCategory = categories.find((cat) => cat.value === category);

  const selectedRecurrence = recurrences.find(
    (rec) => rec.value === recurrence
  );

  const selectedOption = sortOptions.find((opt) => opt.value === sortValue);

  const selectedDirection = sortDirection.find(
    (dir) => dir.value === direction
  );

  return (
    <>
      <button
        className={cn(
          "flex w-fit items-center gap-1 rounded-full bg-slate-800 px-3 py-1.5 font-semibold text-xs",
          filterEnable && "bg-primary/10 text-primary [&>svg]:text-primary"
        )}
        onClick={() => setFilterEnable((prev) => !prev)}
        type="button"
      >
        <ListTodo className="size-3 text-slate-500" />
        <span className="mt-0.5">{"فیلتر و مرتب‌سازی"}</span>
      </button>

      {filterEnable ? (
        <div className="mt-2 space-y-3 rounded-2xl border border-primary/10 bg-primary/5 p-3 text-xs">
          <div className="flex items-center justify-between border-primary/10 border-b pb-1.5">
            <span className="font-bold text-foreground">
              {"فیلتر و مرتب‌سازی"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Category */}
            <div>
              <Label className="mb-1 block font-semibold text-muted-foreground text-xs">
                {"دسته‌بندی"}
              </Label>

              <Select
                onValueChange={(value) => setCategory(value as CategoryValue)}
                value={category}
              >
                <SelectTrigger className="h-8 w-full border border-primary/10 bg-primary/10 text-xs [&>svg]:text-foreground">
                  <SelectValue>{selectedCategory?.label}</SelectValue>
                </SelectTrigger>

                <SelectContent className="w-full rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent text-xs",
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
            </div>

            {/* Recurrence */}
            <div>
              <Label className="mb-1 block font-semibold text-muted-foreground text-xs">
                {"نوع تکرار"}
              </Label>

              <Select
                onValueChange={(value) =>
                  setRecurrence(value as RecurrenceValue)
                }
                value={recurrence}
              >
                <SelectTrigger className="h-8 w-full border border-primary/10 bg-primary/10 text-xs [&>svg]:text-foreground">
                  <SelectValue>{selectedRecurrence?.label}</SelectValue>
                </SelectTrigger>

                <SelectContent className="rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {recurrences.map((rec) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent text-xs",
                          rec.value === recurrence && "bg-accent text-primary"
                        )}
                        key={rec.value}
                        value={rec.value}
                      >
                        {rec.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label className="mb-1 block font-semibold text-muted-foreground text-xs">
                {"مرتب‌سازی بر اساس"}
              </Label>

              <Select
                onValueChange={(value) => setSortValue(value as SortValue)}
                value={sortValue}
              >
                <SelectTrigger className="h-8 w-full border border-primary/10 bg-primary/10 text-xs [&>svg]:text-foreground">
                  <SelectValue>{selectedOption?.label}</SelectValue>
                </SelectTrigger>

                <SelectContent className="rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {sortOptions.map((opt) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent text-xs",
                          opt.value === sortValue && "bg-accent text-primary"
                        )}
                        key={opt.value}
                        value={opt.value}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Direction */}
            <div>
              <Label className="mb-1 block font-semibold text-muted-foreground text-xs">
                {"جهت"}
              </Label>

              <Select
                onValueChange={(value) => setDirection(value as Direction)}
                value={direction}
              >
                <SelectTrigger className="h-8 w-full border border-primary/10 bg-primary/10 text-xs [&>svg]:text-foreground">
                  <SelectValue>{selectedDirection?.label}</SelectValue>
                </SelectTrigger>

                <SelectContent className="rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {sortDirection.map((dir) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent text-xs",
                          dir.value === direction && "bg-accent text-primary"
                        )}
                        key={dir.value}
                        value={dir.value}
                      >
                        {dir.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
