"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AddCategoryDialog() {
  const [categoryName, setCategoryName] = useState("");

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={
              "flex w-fit items-center gap-1 rounded-full bg-primary/10 p-2 text-primary text-xs hover:bg-primary/20"
            }
          >
            <span>{"افزودن"}</span>
            <Plus className="size-4!" />
          </Button>
        }
      />
      <DialogContent
        className="max-w-sm! border border-primary/10 bg-primary/5 backdrop-blur-md"
        // biome-ignore lint/performance/noJsxPropsBind: No performance issue
        onKeyDownCapture={(e) => {
          e.stopPropagation();
        }}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{"افزودن دسته‌‌بندی"}</DialogTitle>
          <DialogDescription>
            {"اسم دسته‌بندی که می‌خوای اضافه کنی رو وارد کن"}
          </DialogDescription>
        </DialogHeader>

        <Input
          id="add-category"
          // biome-ignore lint/performance/noJsxPropsBind: No performance issue
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="مثال: سرگرمی و آخر هفته"
          type="text"
          value={categoryName}
        />

        <DialogFooter className="flex flex-row">
          <Button
            className={
              "flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            }
            disabled={!categoryName.trim()}
          >
            {"افزودن"}
          </Button>

          <DialogClose
            render={
              <Button
                className={"flex-1 border-destructive/20"}
                variant={"destructive"}
              >
                {"بستن"}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
