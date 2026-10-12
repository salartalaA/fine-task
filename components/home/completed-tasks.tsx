"use client";

import {
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Folder,
  ListTodo,
  Loader2,
  Pin,
  Plus,
  Repeat,
  Square,
  SquareCheck,
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
import { deleteUserTask, togglePinTask } from "@/app/actions/task";
import { TaskDetailsDialog } from "@/components/home/task-details-dialog";
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
import type { Task } from "./all-tasks";

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

interface CompletedTasksForm {
  newSteps: Record<string, string>;
}

export default function CompletedTasks({ tasks }: { tasks: Task[] }) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompletedTasksForm>({
    defaultValues: {
      newSteps: {},
    },
  });

  const newSteps = watch("newSteps");

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

  const handleCreateSubTask = async (
    taskId: string,
    data: CompletedTasksForm
  ) => {
    const title = data.newSteps[taskId] ?? "";

    if (!title.trim()) {
      return;
    }

    const result = await createSubTask({
      taskId,
      title: title.trim(),
    });

    if (!result.success) {
      return toast.error(result.message);
    }

    setValue(`newSteps.${taskId}`, "");
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1">
          <CheckCheck className="size-4 stroke-foreground" />
          {"کامل شده‌ها"}
        </span>

        <span className="text-muted-foreground text-xs">
          {tasks.length} {"تسک"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => {
          const showSubTasks = expandedTaskIds.includes(task.id);
          const newStep = newSteps[task.id] ?? "";
          const doneSubTasks = task.subTasks.filter(
            (subTask) => subTask.isDone
          );

          return (
            <div key={task.id}>
              <Card
                className={cn(
                  "m-0 flex flex-row items-center gap-3.5 rounded-md border border-primary/10 bg-accent p-4 py-3.5 ring-0",
                  showSubTasks && "rounded-b-none"
                )}
              >
                <CircleCheck className="size-6 shrink-0 rounded-sm fill-emerald-500 stroke-foreground" />

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center font-semibold text-muted-foreground text-sm line-through">
                      <TaskDetailsDialog taskTitle={task.title} />
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 text-[10px] text-foreground/80">
                    <div className="flex flex-wrap items-center gap-1 gap-y-2">
                      <Folder className="size-3 text-indigo-500" />

                      <span>{task.category?.value ?? "بدون دسته‌بندی"}</span>

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
                          {doneSubTasks.length}/{task.subTasks.length}
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
                      {task.subTasks.map((subTask) => (
                        <div
                          className="flex items-center justify-between"
                          key={subTask.id}
                        >
                          <button
                            className="flex items-center gap-2 text-right"
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
                                subTask.isDone &&
                                  "text-muted-foreground line-through"
                              )}
                            >
                              {subTask.title}
                            </span>
                          </button>

                          <button
                            aria-label="حذف ساب‌تسک"
                            onClick={() =>
                              handleDeleteSubTask(subTask.id, task.id)
                            }
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
                      {...register(`newSteps.${task.id}`)}
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
                      disabled={!newStep.trim() || isSubmitting}
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
        })}
      </div>
    </>
  );
}
