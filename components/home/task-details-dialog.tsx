import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Folder,
  ListTodo,
  Plus,
  Repeat,
  Square,
  SquareCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "../ui/card";

type ActiveRecurrence = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY";

interface Category {
  label: string;
  value: string;
}

interface Recurrence {
  label: string;
  value: ActiveRecurrence;
}

export function TaskDetailsDialog({ taskTitle }: { taskTitle: string }) {
  const [isDone, setIsDone] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("INBOX");
  const [dueDate, setDueDate] = useState("2026-10-03");
  const [recurrence, setRecurrence] = useState<ActiveRecurrence>("ONE_TIME");

  const [open, setOpen] = useState(false);

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

  const selectedCategory = categories.find((cat) => cat.value === category);

  const selectedRecurrence = recurrences.find(
    (rec) => rec.value === recurrence
  );

  return (
    <Dialog onOpenChange={() => setOpen(false)} open={open}>
      <DialogTrigger
        render={() => (
          <button
            className="transition-colors hover:text-primary"
            onClick={() => setOpen(true)}
            type="button"
          >
            {taskTitle}
          </button>
        )}
      />

      <DialogContent
        className={cn(
          "flex max-h-[88vh] max-w-sm flex-col gap-0 overflow-hidden rounded-3xl bg-primary/5 p-0 ring-primary/10 backdrop-blur-md",
          open && "duration-100"
        )}
        showCloseButton={false}
      >
        {/* Modal Header */}
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-primary/10 border-b p-5 pb-3">
          <Button
            className={cn(
              "h-8 rounded-xl border border-primary/20 bg-primary/10 px-3 text-xs hover:bg-primary/20",
              isDone &&
                "border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
            )}
            onClick={() => setIsDone(!isDone)}
          >
            {isDone ? (
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Circle className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span>{isDone ? "انجام شده" : "علامت زدن به عنوان انجام شده"}</span>
          </Button>

          <Button
            className="h-8 w-8 rounded-xl bg-transparent hover:bg-transparent"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 py-3.5">
          {/* Task Name Input */}
          <div className="flex flex-col gap-1">
            <Label className="font-semibold" htmlFor="task-name">
              {"نام تسک"}
            </Label>

            <Input
              className="border-primary/20 font-semibold text-xs!"
              id="task-name"
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="خرید هفتگی مواد غذایی و محصولات تازه"
              value={taskName}
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1">
            <Label className="font-semibold" htmlFor="note">
              {"نوت"}
            </Label>

            <Textarea
              className="border-primary/20 font-semibold text-xs!"
              id="note"
              onChange={(e) => setNote(e.target.value)}
              placeholder="به بازار محلی یا سوپرمارکت بروید. سبزیجات تازه، اقلام ضروری آشپزخانه و مواد لازم برای صبحانه تهیه کنید."
              rows={3}
              value={note}
            />
          </div>

          {/* Options Grid */}
          <div className="flex justify-between gap-2 text-xs">
            {/* Category */}
            <div className="flex-1 rounded-md border border-primary/20 bg-primary/5 p-2.5 pb-0">
              <span className="flex items-center gap-1 font-semibold text-sm">
                <Folder className="size-3 text-indigo-500" />
                <span>{"دسته‌بندی"}</span>
              </span>

              <Select
                onValueChange={(value) => setCategory(value as string)}
                value={category}
              >
                <SelectTrigger className="w-full bg-transparent [&>svg]:text-foreground">
                  <SelectValue className={"text-xs"}>
                    {selectedCategory?.label}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  className={
                    "mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md"
                  }
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
            </div>

            {/* Due Date */}
            <div className="flex-1 rounded-md border border-primary/20 bg-primary/5 p-2.5 pb-0">
              <span className="flex items-center gap-1 font-semibold text-sm">
                <CalendarIcon className="size-3 text-primary" />
                <span>{"مهلت"}</span>
              </span>

              {/* TODO: Add a persian date picker */}

              <Input
                className="h-auto border-0 bg-transparent p-0 font-medium text-xs"
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                value={dueDate}
              />
            </div>
          </div>

          {/* Repeat */}
          <div className="w-1/2 rounded-md border border-primary/20 bg-primary/5 p-2.5 pb-0">
            <span className="flex items-center gap-1 font-semibold text-sm">
              <Repeat className="size-3 text-emerald-500" />
              <span>{"تکرار"}</span>
            </span>

            <Select
              onValueChange={(value) =>
                setRecurrence(value as ActiveRecurrence)
              }
              value={recurrence}
            >
              <SelectTrigger className="w-full bg-transparent [&>svg]:text-foreground">
                <SelectValue className={"text-xs"}>
                  {selectedRecurrence?.label}
                </SelectValue>
              </SelectTrigger>

              <SelectContent
                className={"-mr-4 rounded-lg bg-card/10 backdrop-blur-md"}
              >
                <SelectGroup className={"flex flex-col gap-1"}>
                  {recurrences.map((req) => (
                    <SelectItem
                      className={cn(
                        "bg-transparent",
                        req.value === recurrence && "bg-accent text-primary"
                      )}
                      key={req.value}
                      value={req.value}
                    >
                      {req.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Checklist Steps */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-slate-500 text-xs">
                <ListTodo className="size-3.5" />
                <span>{"قدم‌های چک‌لیست"}</span>
              </span>
              <span className="font-mono text-slate-400 text-xs">{"2/4"}</span>
            </div>

            {/* Checklist Items */}
            <Card className="bg-transparent py-3.5 ring-0">
              <CardContent className="p-0 text-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-sm border border-primary/10 bg-primary/5 p-3">
                    <button className="flex items-center gap-2" type="button">
                      <Square className="size-4 shrink-0 rounded-sm stroke-slate-500" />

                      <span>{"بیبی‌اسفناج ارگانیک، لیمو و آووکادو"}</span>
                    </button>

                    <button className="flex items-center gap-2" type="button">
                      <X className="size-3 shrink-0 rounded-sm stroke-slate-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-sm border border-primary/10 bg-primary/5 p-3">
                    <button className="flex items-center gap-2" type="button">
                      <SquareCheck className="size-4 shrink-0 fill-emerald-500" />

                      <span className="text-muted-foreground line-through">
                        {"روغن زیتون فرابکر و ماست یونانی"}
                      </span>
                    </button>

                    <button className="flex items-center gap-2" type="button">
                      <X className="size-3 shrink-0 rounded-sm stroke-slate-500" />
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center gap-2 p-0">
                <Input
                  className="border-primary/20 text-sm"
                  placeholder="اضافه کردن قدم جدید (مثلا آووکادو)"
                />

                <Button
                  className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                  type="submit"
                >
                  <Plus size={20} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mb-2 flex justify-end border-primary/10 border-t p-5 pb-3">
          <Button className="w-full bg-primary px-6 py-5 font-bold text-white text-xs">
            {"ذخیره تغییرات"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
