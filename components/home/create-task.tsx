"use client";

import { ListMinus, ListPlus, Plus, X } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import TaskProperties from "@/components/home/task-properties/task-properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface CheckListItem {
  id: string;
  text: string;
}

export default function CreateTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [checkListItems, setCheckListItems] = useState<CheckListItem[]>([]);

  const [checkListValue, setCheckListValue] = useState("");

  const [showSubtasks, setShowSubtasks] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleAddCheckListItem = () => {
    if (checkListValue.trim() === "") {
      return;
    }

    setCheckListItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: checkListValue.trim() },
    ]);

    setCheckListValue("");
  };

  const handleRemoveSubTask = (id: string) => {
    setCheckListItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <form className="rounded-lg bg-accent p-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Input
          className="border-primary/20 text-sm"
          // biome-ignore lint/performance/noJsxPropsBind: No performance issue
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="اضافه کردن تسک ..."
          value={taskTitle}
        />
        <Button
          className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
          disabled={!taskTitle.trim()}
          type="submit"
        >
          <Plus size={20} />
        </Button>
      </div>

      <Separator className={"mt-4 mb-2 bg-primary/30"} />

      <TaskProperties />

      <button
        className="mt-3 mr-2 flex items-center gap-2 text-sm"
        // biome-ignore lint/performance/noJsxPropsBind: No performance issue
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
                        // biome-ignore lint/performance/noJsxPropsBind: No performance issue
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
                  // biome-ignore lint/performance/noJsxPropsBind: No performance issue
                  onChange={(e) => setCheckListValue(e.target.value)}
                  placeholder="قدم‌های چک‌لیستت رو تایپ کن ..."
                  value={checkListValue}
                />

                <Button
                  className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
                  disabled={!checkListValue.trim()}
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
