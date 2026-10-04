"use client";

import {
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Folder,
  ListTodo,
  Pin,
  Plus,
  Repeat,
  Square,
  SquareCheck,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
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

export default function CompletedTasks() {
  const tasks = [
    {
      id: "task-1",
      title: "خرید هفتگی مواد غذایی و محصولات تازه",
    },
  ];

  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const [newSteps, setNewSteps] = useState<Record<string, string>>({});
  const [pinnedTaskIds, setPinnedTaskIds] = useState<string[]>([]);

  const toggleSubTasks = (taskId: string) => {
    setExpandedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  };

  const toggleTaskPin = (taskId: string) => {
    setPinnedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
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

          return (
            <div key={task.id}>
              <Card
                className={cn(
                  "m-0 flex flex-row items-center gap-3.5 rounded-md border border-primary/10 bg-accent p-4 py-3.5 ring-0",
                  showSubTasks && "rounded-b-none"
                )}
              >
                {/* <Circle className="size-6 shrink-0 rounded-sm stroke-primary/30" /> */}

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

                      <span>{"خانه و کارهای روزمره"}</span>

                      <span className="mx-1">{"•"}</span>

                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Calendar className="size-3" />
                        {"امروز"}
                      </span>

                      <span className="mx-1">{"•"}</span>

                      <span className="flex items-center gap-1 font-semibold text-emerald-500">
                        <Repeat className="size-3" />
                        {"روزانه"}
                      </span>

                      <span className="mx-1">{"•"}</span>

                      <button
                        className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-0.5 font-semibold"
                        onClick={() => toggleSubTasks(task.id)}
                        type="button"
                      >
                        <ListTodo className="size-3 text-slate-500" />
                        <span className="mt-0.5">{"0/2"}</span>

                        {showSubTasks ? (
                          <ChevronUp className="-ml-1 size-3" />
                        ) : (
                          <ChevronDown className="-ml-1 size-3" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </div>

                {/* <div className="flex items-center gap-2">
                  <Trash2 className="size-4.5 shrink-0 rounded-sm stroke-slate-500" />
                </div> */}

                <div className="flex items-center gap-2">
                  <button onClick={() => toggleTaskPin(task.id)} type="button">
                    <Pin
                      className={cn(
                        "size-4.5 shrink-0 rounded-sm",
                        pinnedTaskIds.includes(task.id)
                          ? "fill-primary stroke-primary"
                          : "stroke-slate-500"
                      )}
                    />
                  </button>

                  <Trash2 className="size-4.5 shrink-0 rounded-sm stroke-slate-500" />
                </div>
              </Card>

              {showSubTasks ? (
                <Card className="rounded-md rounded-t-none border border-primary/10 border-t-0 bg-primary/5 px-4 py-3.5 ring-0">
                  <CardContent className="p-0 text-sm">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center gap-2"
                          type="button"
                        >
                          <Square className="size-4 shrink-0 rounded-sm stroke-slate-500" />

                          <span>{"بیبی‌اسفناج ارگانیک، لیمو و آووکادو"}</span>
                        </button>

                        <button
                          className="flex items-center gap-2"
                          type="button"
                        >
                          <X className="size-3 shrink-0 rounded-sm stroke-slate-500" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center gap-2"
                          type="button"
                        >
                          <SquareCheck className="size-4 shrink-0 fill-emerald-500" />

                          <span className="text-muted-foreground line-through">
                            {"روغن زیتون فرابکر و ماست یونانی"}
                          </span>
                        </button>

                        <button
                          className="flex items-center gap-2"
                          type="button"
                        >
                          <X className="size-3 shrink-0 rounded-sm stroke-slate-500" />
                        </button>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center gap-2 p-0">
                    <Input
                      className="border-primary/20 text-sm"
                      onChange={(e) =>
                        setNewSteps((current) => ({
                          ...current,
                          [task.id]: e.target.value,
                        }))
                      }
                      placeholder="اضافه کردن قدم جدید (مثلا آووکادو)"
                      value={newStep}
                    />

                    <Button
                      className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                      disabled={!newStep.trim()}
                      type="submit"
                    >
                      <Plus size={20} />
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
