"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteCategory } from "@/app/actions/category";
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
import type { CreateTaskData } from "@/lib/validation/task";

interface DeleteCategoryDialogProps {
  categories: CreateTaskData["category"][];
}

interface DeleteCategoryForm {
  categoryId: string;
}

export function DeleteCategoryDialog({
  categories,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<DeleteCategoryForm>({
    defaultValues: {
      categoryId: "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  const handleDeleteCategory = async (data: DeleteCategoryForm) => {
    if (!selectedCategory) {
      return;
    }

    await deleteCategory(data.categoryId);

    reset();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger
        render={
          <Button className="flex w-fit items-center gap-1 rounded-full bg-destructive/10 p-2 text-destructive text-xs hover:bg-destructive/20">
            <span>{"حذف"}</span>
            <Trash2 className="size-3!" />
          </Button>
        }
      />

      <DialogContent
        className="max-w-sm! border border-primary/10 bg-primary/5 backdrop-blur-md"
        onKeyDownCapture={(event) => event.stopPropagation()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{"حذف دسته‌بندی"}</DialogTitle>
          <DialogDescription>
            {"دسته‌بندی مورد نظر برای حذف را انتخاب کن"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleDeleteCategory)}
        >
          <Select
            onValueChange={(value) => {
              setValue("categoryId", value ?? "", {
                shouldValidate: true,
              });
            }}
            value={selectedCategoryId}
          >
            <SelectTrigger className="w-full bg-transparent [&>svg]:text-foreground">
              <SelectValue placeholder="انتخاب دسته‌بندی">
                {selectedCategory?.value}
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md">
              {categories.map((category) => (
                <SelectItem
                  className="bg-transparent"
                  key={category.id}
                  value={category.id}
                >
                  {category.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCategory && (
            <p className="font-semibold text-sm">
              {`مطمئنی که می‌خوای دسته‌بندی «${selectedCategory.value}» رو حذف کنی؟`}
            </p>
          )}

          <DialogFooter className="flex flex-row">
            <Button
              className="flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              disabled={!selectedCategoryId || isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "حذف"}
            </Button>

            <DialogClose
              render={
                <Button
                  className="flex-1 border-destructive/20"
                  onClick={() => reset()}
                  type="button"
                  variant="destructive"
                >
                  {"بستن"}
                </Button>
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
