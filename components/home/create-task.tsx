"use client";

import { Plus } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import TaskProperties from "@/components/home/task-properties/task-properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CreateTask() {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="rounded-lg bg-accent p-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Input
          className="bg-input text-sm"
          // biome-ignore lint/performance/noJsxPropsBind: No performance issue
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="اضافه کردن تسک ..."
          value={taskTitle}
        />
        <Button
          className="rounded-sm bg-primary/10 text-primary hover:bg-primary/20"
          type="submit"
        >
          <Plus size={20} />
        </Button>
      </div>

      <Separator className={"mt-4 mb-2 bg-primary/30"} />

      <TaskProperties />
    </form>
  );
}
