"use client";

import { Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  label: string;
  value: string;
}

interface DeleteCategoryDialogProps {
  categories: Category[];
}

export function DeleteCategoryDialog({
  categories,
}: DeleteCategoryDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const selectedCategoryData = categories.find(
    (category) => category.value === selectedCategory
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={
              "flex w-fit items-center gap-1 rounded-full bg-destructive/10 p-2 text-destructive text-xs hover:bg-destructive/20"
            }
          >
            <span>{"حذف"}</span>
            <Trash2 className="size-3!" />
          </Button>
        }
      />

      <DialogContent
        className="max-w-sm! border border-primary/10 bg-primary/5 backdrop-blur-md"
        onKeyDownCapture={(e) => {
          e.stopPropagation();
        }}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{"حذف دسته‌بندی"}</DialogTitle>

          <DialogDescription>
            {"دسته‌بندی مورد نظر برای حذف را انتخاب کن"}
          </DialogDescription>
        </DialogHeader>

        <Select
          onValueChange={(value) => setSelectedCategory(value as string)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-full bg-primary/10 [&>svg]:text-foreground">
            <SelectValue placeholder="انتخاب دسته‌بندی">
              {selectedCategoryData?.label}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="rounded-lg bg-card/10 backdrop-blur-md">
            {categories.map((category) => (
              <SelectItem
                className="bg-transparent"
                key={category.value}
                value={category.value}
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategoryData && (
          <p className="font-semibold text-sm">
            {`مطمئنی که می‌خوای دسته‌بندی «${selectedCategoryData.label}» رو حذف کنی؟`}
          </p>
        )}

        <DialogFooter className="flex flex-row">
          <Button
            className="flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            disabled={!selectedCategory}
          >
            {"حذف"}
          </Button>

          <DialogClose
            render={
              <Button
                className="flex-1 border-destructive/20"
                variant="destructive"
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
