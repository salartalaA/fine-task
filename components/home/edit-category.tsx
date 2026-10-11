"use client";

import { Pencil } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateTaskData } from "@/lib/validation/task";

interface EditCategoryDialogProps {
  categories: CreateTaskData["category"][];
}

export function EditCategoryDialog({ categories }: EditCategoryDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const selectedCategoryData = categories.find(
    (category) => category.value === selectedCategory
  );

  function handleCategoryChange(value: string) {
    setSelectedCategory(value);

    const category = categories.find((cat) => cat.value === value);

    setCategoryName(category?.value ?? "");
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={
              "flex w-fit items-center gap-1 rounded-full bg-indigo-500/10 p-2 text-indigo-500 text-xs hover:bg-indigo-500/20 hover:text-indigo-500"
            }
          >
            <span>{"ویرایش"}</span>
            <Pencil className="size-3!" />
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
          <DialogTitle>{"ویرایش دسته‌بندی"}</DialogTitle>

          <DialogDescription>
            {"دسته‌بندی مورد نظر را انتخاب و نام جدید را وارد کن"}
          </DialogDescription>
        </DialogHeader>

        <Select
          onValueChange={(value) => handleCategoryChange(value as string)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-full bg-primary/10 [&>svg]:text-foreground">
            <SelectValue placeholder="انتخاب دسته‌بندی">
              {selectedCategoryData?.value}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="rounded-lg bg-card/10 backdrop-blur-md">
            {categories.map((category) => (
              <SelectItem
                className="bg-transparent"
                key={category.value}
                value={category.value}
              >
                {category.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          disabled={!selectedCategory}
          onChange={(e) => {
            setCategoryName(e.target.value);
          }}
          placeholder="نام دسته‌بندی"
          value={categoryName}
        />

        <DialogFooter className="flex flex-row">
          <Button
            className="flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            disabled={!selectedCategory}
          >
            {"ذخیره"}
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
