"use client";

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
import { toast } from "sonner";
import { updateTaskDetails } from "@/app/actions/task";
import type { Due } from "@/app/generated/prisma/enums";
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
import type { Task } from "./all-tasks";
import type { Category } from "./task-properties/task-categories";

type ActiveRecurrence = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY";

interface RecurrenceOption {
  label: string;
  value: ActiveRecurrence;
}

interface DueDate {
  label: string;
  value: Due;
}

interface DraftSubTask {
  id: string | null;
  isDone: boolean;
  localId: string;
  title: string;
}

export function TaskDetailsDialog({
  task,
  taskTitle,
  categories,
}: {
  task: Task;
  taskTitle: string;
  categories: Category[];
}) {
  const [isDone, setIsDone] = useState(task.isDone);
  const [taskName, setTaskName] = useState(task.title);
  const [note, setNote] = useState(task.notes ?? "");
  const [category, setCategory] = useState(task.category?.value);
  const [due, setDue] = useState(task.dueAt);
  const [recurrence, setRecurrence] = useState<ActiveRecurrence>(
    task.recurrence
  );
  const [open, setOpen] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [draftSubTasks, setDraftSubTasks] = useState<DraftSubTask[]>(() =>
    task.subTasks.map((subTask) => ({
      id: subTask.id,
      isDone: subTask.isDone,
      localId: subTask.id,
      title: subTask.title,
    }))
  );

  const recurrences: RecurrenceOption[] = [
    { label: "یک بار", value: "ONE_TIME" },
    { label: "روزانه", value: "DAILY" },
    { label: "هفتگی", value: "WEEKLY" },
    { label: "ماهانه", value: "MONTHLY" },
  ];

  const dueDates: DueDate[] = [
    { label: "امروز", value: "TODAY" },
    { label: "فردا", value: "TOMORROW" },
    { label: "پس فردا", value: "AFTER_TOMORROW" },
  ];

  const selectedCategory = categories.find((cat) => cat.value === category);

  const selectedRecurrence = recurrences.find(
    (rec) => rec.value === recurrence
  );

  const selectedDue = dueDates.find((dueDate) => dueDate.value === due);

  const doneSubTasks = draftSubTasks.filter((subTask) => subTask.isDone);

  const handleCreateSubTask = () => {
    const title = newSubTaskTitle.trim();

    if (!title) {
      return;
    }

    setDraftSubTasks((current) => [
      ...current,
      {
        id: null,
        isDone: false,
        localId: crypto.randomUUID(),
        title,
      },
    ]);

    setNewSubTaskTitle("");
  };

  const handleToggleSubTask = (localId: string) => {
    setDraftSubTasks((current) =>
      current.map((subTask) =>
        subTask.localId === localId
          ? { ...subTask, isDone: !subTask.isDone }
          : subTask
      )
    );
  };

  const handleDeleteSubTask = (localId: string) => {
    setDraftSubTasks((current) =>
      current.filter((subTask) => subTask.localId !== localId)
    );
  };

  const handleSubmit = async (taskId: string) => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    const data = {
      categoryId: categories.find((cat) => cat.value === category)?.id ?? null,
      dueAt: due,
      isDone,
      notes: note,
      recurrence,
      subTasks: draftSubTasks.map(({ id, title, isDone: subTaskIsDone }) => ({
        id,
        isDone: subTaskIsDone,
        title,
      })),
      title: taskName,
    };

    const result = await updateTaskDetails(taskId, data);

    if (!result.success) {
      return toast.error(result.message);
    }

    setOpen(false);
    setIsPending(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
          "flex max-h-[88vh] max-w-sm! flex-col gap-0 overflow-hidden rounded-3xl bg-primary/5 p-0 ring-primary/10 backdrop-blur-md",
          open && "duration-100"
        )}
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-primary/10 border-b p-5 pb-3">
          <Button
            className={cn(
              "h-8 rounded-xl border border-primary/20 bg-primary/10 px-3 text-xs hover:bg-primary/20",
              isDone &&
                "border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
            )}
            onClick={() => setIsDone((current) => !current)}
            type="button"
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
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 py-3.5">
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

          <div className="flex flex-col gap-1">
            <Label className="font-semibold" htmlFor="note">
              {"نوت"}
            </Label>

            <Textarea
              className="border-primary/20 font-semibold text-xs!"
              id="note"
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات تسک"
              rows={3}
              value={note}
            />
          </div>

          <div className="flex justify-between gap-2 text-xs">
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
                  <SelectValue className="text-xs">
                    {selectedCategory?.value}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent",
                          cat.value === category && "bg-accent text-primary"
                        )}
                        key={cat.id}
                        value={cat.value}
                      >
                        {cat.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 rounded-md border border-primary/20 bg-primary/5 p-2.5 pb-0">
              <span className="flex items-center gap-1 font-semibold text-sm">
                <CalendarIcon className="size-3 text-primary" />
                <span>{"مهلت"}</span>
              </span>

              <Select
                onValueChange={(value) => setDue(value as Due)}
                value={due}
              >
                <SelectTrigger className="w-full bg-transparent [&>svg]:text-foreground">
                  <SelectValue className="text-xs">
                    {selectedDue?.label}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="w-fit rounded-lg bg-card/10 backdrop-blur-md">
                  <SelectGroup className="flex flex-col gap-1">
                    {dueDates.map((dueDate) => (
                      <SelectItem
                        className={cn(
                          "bg-transparent",
                          dueDate.value === due && "bg-accent text-primary"
                        )}
                        key={dueDate.value}
                        value={dueDate.value}
                      >
                        {dueDate.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                <SelectValue className="text-xs">
                  {selectedRecurrence?.label}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="-mr-4 rounded-lg bg-card/10 backdrop-blur-md">
                <SelectGroup className="flex flex-col gap-1">
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

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-slate-500 text-xs">
                <ListTodo className="size-3.5" />
                <span>{"قدم‌های چک‌لیست"}</span>
              </span>

              <span className="font-mono text-slate-400 text-xs">
                {doneSubTasks.length}/{draftSubTasks.length}
              </span>
            </div>

            <Card className="bg-transparent py-3.5 ring-0">
              <CardContent className="p-0 text-sm">
                <div className="flex flex-col gap-2">
                  {draftSubTasks.map((subTask) => (
                    <div
                      className="flex items-center justify-between rounded-sm border border-primary/10 bg-primary/5 p-3"
                      key={subTask.localId}
                    >
                      <button
                        className="flex min-w-0 items-center gap-2 text-left"
                        onClick={() => handleToggleSubTask(subTask.localId)}
                        type="button"
                      >
                        {subTask.isDone ? (
                          <SquareCheck className="size-4 shrink-0 fill-emerald-500" />
                        ) : (
                          <Square className="size-4 shrink-0 rounded-sm stroke-slate-500" />
                        )}

                        <span
                          className={cn(
                            subTask.isDone &&
                              "text-muted-foreground line-through"
                          )}
                        >
                          {subTask.title}
                        </span>
                      </button>

                      <button
                        aria-label={`حذف قدم ${subTask.title}`}
                        className="ml-2 flex shrink-0 items-center gap-2"
                        onClick={() => handleDeleteSubTask(subTask.localId)}
                        type="button"
                      >
                        <X className="size-3 rounded-sm stroke-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center gap-2 p-0">
                <Input
                  className="border-primary/20 text-sm"
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateSubTask();
                    }
                  }}
                  placeholder="اضافه کردن قدم جدید (مثلا آووکادو)"
                  value={newSubTaskTitle}
                />

                <Button
                  className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                  disabled={!newSubTaskTitle.trim()}
                  onClick={handleCreateSubTask}
                  type="button"
                >
                  <Plus size={20} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mb-2 flex justify-end border-primary/10 border-t p-5 pb-3">
          <Button
            className="w-full bg-primary px-6 py-5 font-bold text-white text-xs"
            disabled={isPending || !taskName.trim()}
            onClick={() => handleSubmit(task.id)}
            type="button"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
