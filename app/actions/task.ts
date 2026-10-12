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

export async function getUserTasks() {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return [];
  }

  const { user } = currentUser;

  const allTasks = await prisma.task.findMany({
    include: {
      category: true,
      subTasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: user.id,
    },
  });

  return allTasks;
}

export async function deleteUserTask(taskId: string) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده",
      success: false,
    };
  }

  const { user } = currentUser;

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return {
        message: "این تسک وجود ندارد",
        success: false,
      };
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در حذف تسک",
      success: false,
    };
  }
}

export async function toggleDoneTask(taskId: string) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده",
      success: false,
    };
  }

  const { user } = currentUser;

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return {
        message: "این تسک وجود ندارد",
        success: false,
      };
    }

    const updatedTask = await prisma.task.update({
      data: {
        isDone: !existingTask.isDone,
      },
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      isDone: updatedTask.isDone,
      success: true,
    };
  } catch {
    return {
      message: "خطا در انجام تسک",
      success: false,
    };
  }
}

export async function togglePinTask(taskId: string) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser;
  }

  const { user } = currentUser;

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return {
        message: "تسک پیدا نشد.",
        success: false,
      };
    }

    const updatedTask = await prisma.task.update({
      data: {
        isPin: !task.isPin,
      },

      where: {
        id: task.id,
      },
    });

    revalidatePath("/");

    return {
      isPin: updatedTask.isPin,
      success: true,
    };
  } catch {
    return {
      message: "خطا در پین کردن تسک",
      success: false,
    };
  }
}
