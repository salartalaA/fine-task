"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/app/actions/user";
import prisma from "@/lib/prisma";
import { type CreateTaskData, createTaskSchema } from "@/lib/validation/task";

export async function createTask(newTask: CreateTaskData) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده",
      success: false,
    };
  }

  try {
    const validateTask = createTaskSchema.safeParse(newTask);

    if (!validateTask.success) {
      return {
        message: "اطلاعات واردشده معتبر نیستند.",
        success: false,
      };
    }

    const { data } = validateTask;
    const { user } = currentUser;

    const category = await prisma.category.findFirst({
      where: {
        id: data.category.id,
        userId: user.id,
      },
    });

    if (!category) {
      return {
        message: "دسته‌بندی انتخاب‌شده معتبر نیست.",
        success: false,
      };
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        title: data.title,
        userId: user.id,
      },
    });

    if (existingTask) {
      return {
        message: "این تسک در لیست وجود دارد.",
        success: false,
      };
    }

    await prisma.task.create({
      data: {
        categoryId: data.category.id,
        dueAt: data.dueAt,
        isDone: false,
        isPin: false,
        notes: data.notes ?? "",
        recurrence: data.recurrence,
        subTasks: {
          create: data.subTasks?.map((subTask) => ({
            title: subTask?.title ?? "",
          })),
        },
        title: data.title,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در ایجاد تسک",
      success: false,
    };
  }
}
