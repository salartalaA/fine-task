"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListMinus, ListPlus, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTask } from "@/app/actions/task";
import type { Category } from "@/components/home/task-properties/task-categories";
import TaskProperties from "@/components/home/task-properties/task-properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { type CreateTaskData, createTaskSchema } from "@/lib/validation/task";

interface CheckListItem {
  id: string;
  text: string;
}

export default function CreateTask({ categories }: { categories: Category[] }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTaskData>({
    defaultValues: {
      subTasks: [],
    },
    resolver: zodResolver(createTaskSchema),
  });

  const taskTitle = watch("title") ?? "";

  const [checkListItems, setCheckListItems] = useState<CheckListItem[]>([]);

  const [checkListValue, setCheckListValue] = useState("");

  const [showSubtasks, setShowSubtasks] = useState(false);

  const onsubmit = async (newTask: CreateTaskData) => {
    const result = await createTask(newTask);

    if (!result.success) {
      toast.error("message" in result && result.message);
      return;
    }

    reset();

    setCheckListItems([]);

    setCheckListValue("");
  };

  const handleAddCheckListItem = () => {
    const title = checkListValue.trim();

    if (!title) {
      return;
    }

    const updatedItems = [
      ...checkListItems,
      {
        id: crypto.randomUUID(),
        text: title,
      },
    ];

    setCheckListItems(updatedItems);

    setValue(
      "subTasks",
      updatedItems.map((item) => ({ title: item.text })),
      { shouldDirty: true, shouldValidate: true }
    );

    setCheckListValue("");
  };

  const handleRemoveSubTask = (id: string) => {
    const updatedItems = [...checkListItems.filter((item) => item.id !== id)];

    setCheckListItems(updatedItems);

    setValue(
      "subTasks",
      updatedItems.map((item) => ({ title: item.text })),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <form
      className="rounded-lg bg-accent p-2"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex items-center gap-2">
        <Input
          className="border-primary/20 text-sm"
          placeholder="اضافه کردن تسک ..."
          {...register("title")}
        />
        <Button
          className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
          disabled={!taskTitle.trim() || isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Plus size={20} />
          )}
        </Button>
      </div>

      <Separator className={"mt-4 mb-2 bg-primary/30"} />

      <TaskProperties categories={categories} control={control} />

      <button
        className="mt-3 mr-2 flex items-center gap-2 text-sm"
        onClick={() => setShowSubtasks((prev) => !prev)}
        type="button"
      >
        {showSubtasks ? (
          <ListMinus className="scale-x-[-1] text-primary" size={16} />
        ) : (
          <ListPlus className="scale-x-[-1] text-primary" size={16} />
        )}
        <span className="text-muted-foreground">
          {showSubtasks ? "مخفی کردن" : "اضافه کردن ساب‌تسک"}
        </span>
      </button>

      {showSubtasks ? (
        <>
          <Separator className={"mt-4 mb-3 bg-primary/30"} />

          <div className="flex flex-col gap-3">
            <Textarea
              className="border-primary/20 text-sm"
              placeholder="نوت یا لینک (اختیاری) ..."
              {...register("notes")}
            />

            <div className="flex flex-col gap-2">
              {checkListItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {checkListItems.map((checkListItem) => (
                    <Badge
                      className="bg-primary/5 text-primary"
                      key={checkListItem.id}
                    >
                      <button
                        className="transition-colors hover:text-primary/80"
                        onClick={() => handleRemoveSubTask(checkListItem.id)}
                        type="button"
                      >
                        <X size={14} />
                      </button>

                      <span className="text-xs">{checkListItem.text}</span>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex w-full items-center gap-2">
                <Input
                  className="border-primary/20 text-sm"
                  onChange={(event) => setCheckListValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddCheckListItem();
                    }
                  }}
                  placeholder="قدم‌های چک‌لیستت رو تایپ کن ..."
                  value={checkListValue}
                />

                <Button
                  className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                  disabled={!checkListValue.trim() || isSubmitting}
                  onClick={handleAddCheckListItem}
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </form>
  );
}
