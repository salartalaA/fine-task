"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/app/actions/user";
import prisma from "@/lib/prisma";
import {
  type CreateSubTaskData,
  createSubTaskSchema,
} from "@/lib/validation/task";

export async function toggleDoneSubTask(subTaskId: string, taskId: string) {
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

    const existingSubTask = await prisma.subTask.findFirst({
      where: {
        id: subTaskId,
        taskId: existingTask.id,
      },
    });

    if (!existingSubTask) {
      return {
        message: "این ساب‌تسک وجود ندارد",
        success: false,
      };
    }

    const updatedSubTask = await prisma.subTask.update({
      data: {
        isDone: !existingSubTask.isDone,
      },
      where: {
        id: existingSubTask.id,
      },
    });

    revalidatePath("/");

    return {
      isDone: updatedSubTask.isDone,
      success: true,
    };
  } catch {
    return {
      message: "خطا در تغییر وضعیت ساب‌تسک",
      success: false,
    };
  }
}

export async function deleteSubTask(subTaskId: string, taskId: string) {
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

    const existingSubTask = await prisma.subTask.findFirst({
      where: {
        id: subTaskId,
        taskId: existingTask.id,
      },
    });

    if (!existingSubTask) {
      return {
        message: "این ساب‌تسک وجود ندارد",
        success: false,
      };
    }

    await prisma.subTask.delete({
      where: {
        id: existingSubTask.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در حذف ساب‌تسک",
      success: false,
    };
  }
}

export async function createSubTask(input: CreateSubTaskData) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return { message: "احراز هویت نشده", success: false };
  }

  const validation = createSubTaskSchema.safeParse(input);

  if (!validation.success) {
    return {
      message: validation.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
      success: false,
    };
  }

  const { user } = currentUser;
  const { taskId, title } = validation.data;

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return { message: "این تسک وجود ندارد.", success: false };
    }

    await prisma.subTask.create({
      data: {
        taskId: existingTask.id,
        title,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در ایجاد ساب‌تسک.",
      success: false,
    };
  }
}
