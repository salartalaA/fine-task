// "use client";

// import { Plus } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { createCategory } from "@/app/actions/category";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import type { Category } from "./task-properties/task-categories";

// export function AddCategoryDialog() {
//   const [categoryName, setCategoryName] = useState<Category["value"]>("");
//   const [open, setOpen] = useState(false);

//   const handleAddCategory = async () => {
//     const result = await createCategory(categoryName);

//     if (!result.success) {
//       return toast.error(result.message);
//     }

//     setOpen(false);
//     setCategoryName("");
//   };

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger
//         render={
//           <Button
//             className={
//               "flex w-fit items-center gap-1 rounded-full bg-primary/10 p-2 text-primary text-xs hover:bg-primary/20"
//             }
//           >
//             <span>{"افزودن"}</span>
//             <Plus className="size-4!" />
//           </Button>
//         }
//       />
//       <DialogContent
//         className="max-w-sm! border border-primary/10 bg-primary/5 backdrop-blur-md"
//         onKeyDownCapture={(e) => {
//           e.stopPropagation();
//         }}
//         showCloseButton={false}
//       >
//         <DialogHeader>
//           <DialogTitle>{"افزودن دسته‌‌بندی"}</DialogTitle>
//           <DialogDescription>
//             {"اسم دسته‌بندی که می‌خوای اضافه کنی رو وارد کن"}
//           </DialogDescription>
//         </DialogHeader>

//         <Input
//           id="add-category"
//           onChange={(e) => setCategoryName(e.target.value)}
//           placeholder="مثال: سرگرمی و آخر هفته"
//           type="text"
//           value={categoryName}
//         />

//         <DialogFooter className="flex flex-row">
//           <Button
//             className={
//               "flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
//             }
//             disabled={!categoryName.trim()}
//             onClick={handleAddCategory}
//           >
//             {"افزودن"}
//           </Button>

//           <DialogClose
//             render={
//               <Button
//                 className={"flex-1 border-destructive/20"}
//                 variant={"destructive"}
//               >
//                 {"بستن"}
//               </Button>
//             }
//           />
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCategory } from "@/app/actions/category";
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
import type { Category } from "./task-properties/task-categories";

interface AddCategoryForm {
  value: Category["value"];
}

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<AddCategoryForm>({
    defaultValues: {
      value: "",
    },
  });

  const categoryName = watch("value");

  const handleAddCategory = async (data: AddCategoryForm) => {
    const value = data.value.trim();

    if (!value) {
      return;
    }

    const result = await createCategory(value);

    if (!result.success) {
      return toast.error(result.message);
    }

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
          <Button className="flex w-fit items-center gap-1 rounded-full bg-primary/10 p-2 text-primary text-xs hover:bg-primary/20">
            <span>{"افزودن"}</span>
            <Plus className="size-4!" />
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
          <DialogTitle>{"افزودن دسته‌بندی"}</DialogTitle>
          <DialogDescription>
            {"اسم دسته‌بندی که می‌خوای اضافه کنی رو وارد کن"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleAddCategory)}
        >
          <Input
            id="add-category"
            placeholder="مثال: سرگرمی و آخر هفته"
            type="text"
            {...register("value", { required: true })}
          />

          <DialogFooter className="flex flex-row">
            <Button
              className="flex-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              disabled={!categoryName?.trim() || isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "افزودن"}
            </Button>

            <DialogClose
              render={
                <Button
                  className="flex-1 border-destructive/20"
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
