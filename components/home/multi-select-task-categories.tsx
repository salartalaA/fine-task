import { Folder } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updatedSelectedTaskCategory } from "@/app/actions/task";
import type { Category } from "@/app/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function MultiSelectTaskCategories({
  categories,
  taskIds,
}: {
  categories: Category[];
  taskIds: string[];
}) {
  const [category, _] = useState<string>("");

  const handleCategoryChange = async (categoryId: string) => {
    const result = await updatedSelectedTaskCategory(taskIds, categoryId);

    if (!result.success) {
      return toast.error(result.message);
    }
  };

  return (
    <Select
      onValueChange={(value) => handleCategoryChange(value as string)}
      value={category}
    >
      <SelectTrigger className="bg-transparent p-0 [&>svg]:hidden">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition-all hover:bg-slate-700"
          type="button"
        >
          <Folder className="h-4 w-4" />
        </button>
      </SelectTrigger>

      <SelectContent
        className={"mr-4 w-fit rounded-lg bg-card/10 backdrop-blur-md"}
      >
        <SelectGroup className={"flex flex-col gap-1"}>
          {categories.map((cat) => (
            <SelectItem
              className={cn(
                "bg-transparent",
                cat.value === category && "bg-accent text-primary"
              )}
              key={cat.id}
              value={cat.id}
            >
              {cat.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
