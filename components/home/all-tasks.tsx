"use client";

import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheck,
  Folder,
  ListTodo,
  Loader2,
  Pin,
  Plus,
  Repeat,
  Square,
  SquareCheck,
  SquareCheckBig,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createSubTask,
  deleteSubTask,
  toggleDoneSubTask,
} from "@/app/actions/sub-task";
import {
  deleteSelectedTasks,
  deleteUserTask,
  doneSelectedTasks,
  toggleDoneTask,
  togglePinTask,
} from "@/app/actions/task";
import type { Category, Prisma } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MultiSelectTaskCategories } from "./multi-select-task-categories";
import { TaskDetailsDialog } from "./task-details-dialog";

const dueDates = {
  AFTER_TOMORROW: "پس فردا",
  TODAY: "امروز",
  TOMORROW: "فردا",
} as const;

const recurrence = {
  DAILY: "روزانه",
  MONTHLY: "ماهانه",
  ONE_TIME: "یک بار",
  WEEKLY: "هفتگی",
} as const;

export type Task = Prisma.TaskGetPayload<{
  include: {
    category: true;
    subTasks: true;
  };
}>;

interface AllTasksForm {
  newSubTaskTitles: Record<string, string>;
}

export default function AllTasks({
  tasks,
  categories,
}: {
  tasks: Task[];
  categories: Category[];
}) {
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<AllTasksForm>({
    defaultValues: {
      newSubTaskTitles: {},
    },
  });

  const newSubTaskTitles = watch("newSubTaskTitles");

  const toggleMultiSelect = () => {
    setIsMultiSelectActive((previous) => {
      if (previous) {
        setSelectedTaskIds([]);
      }

      return !previous;
    });
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  };

  const toggleSubTasks = (taskId: string) => {
    setExpandedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  };

  const toggleTaskPin = async (taskId: string) => {
    const result = await togglePinTask(taskId);

    if (!result.success && "message" in result) {
      return toast.error(result.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteUserTask(taskId);

    if (!result.success) {
      return toast.error(result.message);
    }
  };

  const handleDoneToggleTask = async (taskId: string) => {
    const result = await toggleDoneTask(taskId);

    if (!result.success) {
      return toast.error(result.message);
    }
  };

  const handleDoneToggleSubTask = async (subTaskId: string, taskId: string) => {
    const result = await toggleDoneSubTask(subTaskId, taskId);

    if (!result.success) {
      return toast.error(result.message);
    }
  };

  const handleDeleteSubTask = async (subTaskId: string, taskId: string) => {
    const result = await deleteSubTask(subTaskId, taskId);

    if (!result.success) {
      return toast.error(result.message);
    }
  };

  const handleCreateSubTask = async (taskId: string, data: AllTasksForm) => {
    const title = data.newSubTaskTitles[taskId] ?? "";

    if (!title.trim()) {
      return;
    }

    const result = await createSubTask({
      taskId,
      title: title.trim(),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setValue(`newSubTaskTitles.${taskId}`, "");
  };

  const handleDoneSelectedTasks = async () => {
    const result = await doneSelectedTasks(selectedTaskIds);

    if (!result.success) {
      return toast.error(result.message);
    }

    setSelectedTaskIds([]);
    setIsMultiSelectActive(false);
  };

  const handleDeleteSelectedTasks = async () => {
    const result = await deleteSelectedTasks(selectedTaskIds);

    if (!result.success) {
      return toast.error(result.message);
    }

    setSelectedTaskIds([]);
    setIsMultiSelectActive(false);
  };

  const pinnedTasks = tasks.filter((task) => task.isPin);

  const unpinnedTasks = tasks.filter((task) => !task.isPin);

  const todayTasks = unpinnedTasks.filter((task) => task.dueAt === "TODAY");

  const tomorrowTasks = unpinnedTasks.filter(
    (task) => task.dueAt === "TOMORROW"
  );

  const afterTomorrowTasks = unpinnedTasks.filter(
    (task) => task.dueAt === "AFTER_TOMORROW"
  );

  const taskGroups = [
    {
      key: "TODAY",
      tasks: todayTasks,
      title: "امروز",
    },
    {
      key: "TOMORROW",
      tasks: tomorrowTasks,
      title: "فردا",
    },
    {
      key: "AFTER_TOMORROW",
      tasks: afterTomorrowTasks,
      title: "پس فردا",
    },
  ].filter((group) => group.tasks.length > 0 || group.key === "TODAY");

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Intentional
  const renderTaskCard = (task: Task) => {
    const isSelected = selectedTaskIds.includes(task.id);
    const showSubTasks = expandedTaskIds.includes(task.id);
    const allSubTasks = task.subTasks;
    const doneSubTasks = allSubTasks.filter((subTask) => subTask.isDone);
    const newSubTaskTitle = newSubTaskTitles[task.id] ?? "";

    return (
      <div key={task.id}>
        <Card
          className={cn(
            "m-0 flex flex-row items-center gap-3.5 rounded-md border border-primary/10 bg-accent p-4 py-3.5 ring-0",
            showSubTasks && "rounded-b-none"
          )}
        >
          {isMultiSelectActive ? (
            <button
              className="shrink-0"
              onClick={() => toggleTaskSelection(task.id)}
              type="button"
            >
              {isSelected ? (
                <SquareCheckBig className="size-6 rounded-sm stroke-primary" />
              ) : (
                <Square className="size-6 rounded-sm stroke-primary/30" />
              )}
            </button>
          ) : // biome-ignore lint/style/noNestedTernary: Nested ternary keeps the task status rendering concise.
          task.isDone ? (
            <button
              aria-label="علامت‌گذاری به‌عنوان انجام‌نشده"
              onClick={() => handleDoneToggleTask(task.id)}
              type="button"
            >
              <CircleCheck className="size-6 shrink-0 rounded-sm fill-emerald-500 stroke-foreground" />
            </button>
          ) : (
            <button
              aria-label="علامت‌گذاری به‌عنوان انجام‌شده"
              onClick={() => handleDoneToggleTask(task.id)}
              type="button"
            >
              <Circle className="size-6 shrink-0 rounded-sm stroke-primary/30" />
            </button>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <CardHeader className="p-0">
              <CardTitle className="font-semibold text-sm">
                <TaskDetailsDialog
                  categories={categories}
                  task={task}
                  taskTitle={task.title}
                />
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 text-[10px] text-foreground/80">
              <div className="flex flex-wrap items-center gap-1 gap-y-2">
                <Folder className="size-3 text-indigo-500" />

                <span>{task.category?.value}</span>

                <span className="mx-1">{"•"}</span>

                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Calendar className="size-3" />
                  {dueDates[task.dueAt]}
                </span>

                <span className="mx-1">{"•"}</span>

                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <Repeat className="size-3" />
                  {recurrence[task.recurrence]}
                </span>

                <span className="mx-1">{"•"}</span>

                <button
                  className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-0.5 font-semibold"
                  onClick={() => toggleSubTasks(task.id)}
                  type="button"
                >
                  <ListTodo className="size-3 text-slate-500" />

                  <span className="mt-0.5">
                    {doneSubTasks.length}/{allSubTasks.length}
                  </span>

                  {showSubTasks ? (
                    <ChevronUp className="-ml-1 size-3" />
                  ) : (
                    <ChevronDown className="-ml-1 size-3" />
                  )}
                </button>
              </div>
            </CardContent>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label={task.isPin ? "برداشتن پین" : "پین کردن تسک"}
              onClick={() => toggleTaskPin(task.id)}
              type="button"
            >
              <Pin
                className={cn(
                  "size-4.5 shrink-0 rounded-sm",
                  task.isPin
                    ? "fill-primary stroke-primary"
                    : "stroke-slate-500"
                )}
              />
            </button>

            <button
              aria-label="حذف تسک"
              onClick={() => handleDeleteTask(task.id)}
              type="button"
            >
              <Trash2 className="size-4.5 shrink-0 rounded-sm stroke-slate-500" />
            </button>
          </div>
        </Card>

        {showSubTasks ? (
          <Card className="rounded-md rounded-t-none border border-primary/10 border-t-0 bg-primary/5 px-4 py-3.5 ring-0">
            <CardContent className="p-0 text-sm">
              <div className="flex flex-col gap-4">
                {allSubTasks.map((subTask) => (
                  <div
                    className="flex items-center justify-between"
                    key={subTask.id}
                  >
                    <button
                      className="flex items-center gap-2"
                      onClick={() =>
                        handleDoneToggleSubTask(subTask.id, task.id)
                      }
                      type="button"
                    >
                      {subTask.isDone ? (
                        <SquareCheck className="size-4 shrink-0 fill-emerald-500" />
                      ) : (
                        <Square className="size-4 shrink-0 rounded-sm stroke-slate-500" />
                      )}

                      <span
                        className={cn(
                          subTask.isDone && "text-muted-foreground line-through"
                        )}
                      >
                        {subTask.title}
                      </span>
                    </button>

                    <button
                      aria-label="حذف ساب‌تسک"
                      className="flex items-center gap-2"
                      onClick={() => handleDeleteSubTask(subTask.id, task.id)}
                      type="button"
                    >
                      <X className="size-3 shrink-0 rounded-sm stroke-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex items-center gap-2 p-0">
              <Input
                className="border-primary/20 text-sm"
                placeholder="اضافه کردن قدم جدید (مثلا آووکادو)"
                {...register(`newSubTaskTitles.${task.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();

                    handleSubmit((data) =>
                      handleCreateSubTask(task.id, data)
                    )();
                  }
                }}
              />

              <Button
                className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                disabled={!newSubTaskTitle.trim() || isSubmitting}
                onClick={handleSubmit((data) =>
                  handleCreateSubTask(task.id, data)
                )}
                type="button"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div>
        {/* START MULTI-SELECT */}
        <div>
          <Button
            className={cn(
              "mb-3 bg-transparent text-muted-foreground text-sm hover:text-foreground",
              isMultiSelectActive && "bg-primary text-foreground"
            )}
            onClick={toggleMultiSelect}
            type="button"
          >
            {isMultiSelectActive ? (
              <SquareCheckBig size={20} />
            ) : (
              <Square size={20} />
            )}

            {"انتخاب همگانی"}
          </Button>
        </div>
        {/* END MULTI-SELECT */}

        {/* START PINNED SECTION */}
        {pinnedTasks.length > 0 ? (
          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-primary">
                <Pin className="size-4" />
                {"پین شده"}
              </span>

              <span className="text-muted-foreground text-xs">
                {pinnedTasks.length} {"تسک"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {pinnedTasks.map(renderTaskCard)}
            </div>
          </section>
        ) : null}
        {/* END PINNED SECTION */}

        {/* START TIME GROUPS */}
        {taskGroups.map((group) => (
          <section className="mb-4" key={group.key}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="size-4 stroke-foreground" />
                {group.title}
              </span>

              <span className="text-muted-foreground text-xs">
                {group.tasks.length} {"تسک"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {group.tasks.map(renderTaskCard)}
            </div>
          </section>
        ))}
        {/* END TIME GROUPS */}
      </div>

      {selectedTaskIds.length > 0 ? (
        <div className="fixed bottom-20 z-40 mx-auto w-full max-w-sm">
          <div className="flex max-w-sm items-center justify-between rounded-2xl border border-primary/10 bg-accent p-2.5">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-500 font-bold text-[11px]">
              {selectedTaskIds.length}
            </span>

            <button
              className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500/20 px-2.5 font-bold text-[11px] text-emerald-300 transition-all hover:bg-emerald-500/30"
              onClick={handleDoneSelectedTasks}
              type="button"
            >
              <CheckCircle className="h-4 w-4" />

              <span>{"علامت به عنوان تمام شده"}</span>
            </button>

            <MultiSelectTaskCategories
              categories={categories}
              taskIds={selectedTaskIds}
            />

            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 transition-all hover:bg-red-500/30"
              onClick={handleDeleteSelectedTasks}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
