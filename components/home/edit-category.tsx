"use client";

import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateCategory } from "@/app/actions/category";
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

interface EditCategoryForm {
  categoryId: string;
  value: string;
}

export function EditCategoryDialog({ categories }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<EditCategoryForm>({
    defaultValues: {
      categoryId: "",
      value: "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  const handleEditCategory = async (data: EditCategoryForm) => {
    if (!selectedCategory) {
      return;
    }

    await updateCategory({
      id: selectedCategory.id,
      value: data.value,
    });

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
          <Button className="flex w-fit items-center gap-1 rounded-full bg-indigo-500/10 p-2 text-indigo-500 text-xs hover:bg-indigo-500/20 hover:text-indigo-500">
            <span>{"ویرایش"}</span>
            <Pencil className="size-3!" />
          </Button>
        }
      />

      <DialogContent
        className="max-w-sm! border border-primary/10 bg-primary/5 backdrop-blur-md"
        onKeyDownCapture={(event) => event.stopPropagation()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{"ویرایش دسته‌بندی"}</DialogTitle>
          <DialogDescription>
            {"دسته‌بندی مورد نظر را انتخاب و نام جدید را وارد کن"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleEditCategory)}
        >
          <Select
            onValueChange={(value) => {
              const category = categories.find((item) => item.id === value);

              setValue("categoryId", value ?? "", {
                shouldValidate: true,
              });
              setValue("value", category?.value ?? "", {
                shouldDirty: true,
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

          <Input
            {...register("value", { required: true })}
            disabled={!selectedCategoryId}
            placeholder="نام دسته‌بندی"
          />

          <DialogFooter className="flex flex-row">
            <Button
              className="flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              disabled={!selectedCategoryId || isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "ذخیره"}
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
