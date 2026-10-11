import { Folder } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import { AddCategoryDialog } from "@/components/home/add-category";
import { DeleteCategoryDialog } from "@/components/home/delete-category";
import { EditCategoryDialog } from "@/components/home/edit-category";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CreateTaskData } from "@/lib/validation/task";

export type Category = CreateTaskData["category"];

export function TaskCategories({
  control,
  categories,
}: {
  control: Control<CreateTaskData>;
  categories: Category[];
}) {
  return (
    <Controller
      control={control}
      defaultValue={categories[0]}
      name="category"
      render={({ field }) => {
        const selectedCategory = categories.find(
          (category) => category.id === field.value?.id
        );

        return (
          <Select
            onValueChange={(id) => {
              const selected = categories.find(
                (category) => category.id === id
              );

              if (selected) {
                field.onChange(selected);
              }
            }}
            value={field.value?.id ?? ""}
          >
            <SelectTrigger className="w-full max-w-fit bg-primary/10 [&>svg]:text-foreground">
              <Folder className="text-indigo-500!" />
              <SelectValue placeholder="انتخاب دسته‌بندی">
                {selectedCategory?.value}
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md">
              <SelectGroup className="flex flex-col gap-1">
                {categories.map((category) => (
                  <SelectItem
                    className={cn(
                      "bg-transparent",
                      category.id === field.value?.id &&
                        "bg-accent text-primary"
                    )}
                    key={category.id}
                    value={category.id}
                  >
                    {category.value}
                  </SelectItem>
                ))}
              </SelectGroup>

              <Separator className="mt-3 mb-3 bg-primary/30" />

              <div className="mx-2 mb-2 flex items-center justify-center gap-1">
                <AddCategoryDialog />

                <EditCategoryDialog categories={categories} />

                <DeleteCategoryDialog categories={categories} />
              </div>
            </SelectContent>
          </Select>
        );
      }}
    />
  );
}
