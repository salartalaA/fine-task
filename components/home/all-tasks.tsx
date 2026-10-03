"use client";

import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Folder,
  ListTodo,
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

// TODO: Add Overdue

// Heave refactor later

const tasks = [
  {
    due: "today",
    id: "task-1",
    title: "خرید هفتگی مواد غذایی و محصولات تازه",
  },
  {
    due: "tomorrow",
    id: "task-2",
    title: "تمیز کردن خانه",
  },
  {
    due: "saturday",
    id: "task-3",
    title: "خرید لوازم شخصی",
  },
] as const;

export default function AllTasks({
  showOtherDues = false,
}: {
  showOtherDues?: boolean;
}) {
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  const [newSteps, setNewSteps] = useState<Record<string, string>>({});

  const [pinnedTaskIds, setPinnedTaskIds] = useState<string[]>([]);

  const toggleMultiSelect = () => {
    setIsMultiSelectActive((prev) => {
      if (prev) {
        setSelectedTaskIds([]);
      }

      return !prev;
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

  const toggleTaskPin = (taskId: string) => {
    setPinnedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  };

  const pinnedTasks = tasks.filter((task) => pinnedTaskIds.includes(task.id));

  const todayTasks = tasks.filter((task) => !pinnedTaskIds.includes(task.id));

  const otherDueTasks = tasks.filter(
    (task) => task.due !== "today" && !pinnedTaskIds.includes(task.id)
  );

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
          <div className="mb-4">
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
              {pinnedTasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id);
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
                      ) : (
                        <Circle className="size-6 shrink-0 rounded-sm stroke-primary/30" />
                      )}

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <CardHeader className="p-0">
                          <CardTitle className="font-semibold text-sm">
                            <TaskDetailsDialog taskTitle={task.title} />
                          </CardTitle>
                        </CardHeader>

                        {/* START PROPERTIES */}
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
                        {/* END PROPERTIES */}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTaskPin(task.id)}
                          type="button"
                        >
                          <Pin className="size-4.5 shrink-0 rounded-sm fill-primary stroke-primary" />
                        </button>

                        <Trash2 className="size-4.5 shrink-0 rounded-sm stroke-slate-500" />
                      </div>
                    </Card>

                    {/* START SUBTASKS */}
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

                                <span>
                                  {"بیبی‌اسفناج ارگانیک، لیمو و آووکادو"}
                                </span>
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
                    {/* END SUBTASKS */}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {/* END PINNED SECTION */}

        {/* START TIME SECTION */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="size-4 stroke-foreground" />
            {"امروز"}
          </span>

          <span className="text-muted-foreground text-xs">
            {todayTasks.length} {"تسک"}
          </span>
        </div>
        {/* END TIME SECTION */}

        {/* START TASK DETAILS SECTION */}
        <div className="flex flex-col gap-2">
          {todayTasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);
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
                  ) : (
                    <Circle className="size-6 shrink-0 rounded-sm stroke-primary/30" />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <CardHeader className="p-0">
                      <CardTitle className="font-semibold text-sm">
                        <TaskDetailsDialog taskTitle={task.title} />
                      </CardTitle>
                    </CardHeader>

                    {/* START PROPERTIES */}
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
                    {/* END PROPERTIES */}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTaskPin(task.id)}
                      type="button"
                    >
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

                {/* START SUBTASKS */}
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
                {/* END SUBTASKS */}
              </div>
            );
          })}
        </div>
        {/* END TASK DETAILS SECTION */}

        {showOtherDues
          ? // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Intentional
            otherDueTasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              const showSubTasks = expandedTaskIds.includes(task.id);

              const newStep = newSteps[task.id] ?? "";

              return (
                <div className="mt-4" key={task.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4 stroke-foreground" />
                      {task.due === "tomorrow"
                        ? "فردا"
                        : // biome-ignore lint/style/noNestedTernary: Intentional
                          task.due === "saturday"
                          ? "شنبه"
                          : task.due}
                    </span>

                    <span className="text-muted-foreground text-xs">
                      {"1"} {"تسک"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
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
                        ) : (
                          <Circle className="size-6 shrink-0 rounded-sm stroke-primary/30" />
                        )}

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <CardHeader className="p-0">
                            <CardTitle className="font-semibold text-sm">
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
                                {task.due === "tomorrow"
                                  ? "فردا"
                                  : // biome-ignore lint/style/noNestedTernary: Intentional
                                    task.due === "saturday"
                                    ? "شنبه"
                                    : task.due}
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

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTaskPin(task.id)}
                            type="button"
                          >
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

                                  <span>
                                    {"بیبی‌اسفناج ارگانیک، لیمو و آووکادو"}
                                  </span>
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
                  </div>
                </div>
              );
            })
          : null}
      </div>

      {selectedTaskIds.length > 0 ? (
        <div className="fixed bottom-20 z-40 mx-auto w-full max-w-sm">
          <div className="flex max-w-sm items-center justify-between rounded-2xl border border-primary/10 bg-accent p-2.5">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-500 font-bold text-[11px]">
              {selectedTaskIds.length}
            </span>

            <button
              className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500/20 px-2.5 font-bold text-[11px] text-emerald-300 transition-all hover:bg-emerald-500/30"
              type="button"
            >
              <CheckCircle className="h-4 w-4" />

              <span>{"علامت به عنوان تمام شده"}</span>
            </button>

            <button
              className="flex h-9 items-center gap-1 rounded-xl bg-slate-800 px-2.5 font-semibold text-slate-300 text-xs transition-all hover:bg-slate-700"
              type="button"
            >
              <Calendar className="h-3.5 w-3.5" />

              <span>{"+1 روز"}</span>
            </button>

            <MultiSelectTaskCategories />

            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 transition-all hover:bg-red-500/30"
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
