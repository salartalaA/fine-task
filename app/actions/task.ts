"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/app/actions/user";
import prisma from "@/lib/prisma";
import { type CreateTaskData, createTaskSchema } from "@/lib/validation/task";
import type { Due, Recurrence } from "../generated/prisma/enums";

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

export async function doneSelectedTasks(taskIds: string[]) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser;
  }

  const { user } = currentUser;

  try {
    await prisma.task.updateMany({
      data: {
        isDone: true,
      },
      where: {
        id: { in: taskIds },
        userId: user.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در علامت زدن گروهی به عنوان انجام شده",
      success: false,
    };
  }
}

export async function deleteSelectedTasks(taskIds: string[]) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser;
  }

  const { user } = currentUser;

  try {
    await prisma.task.deleteMany({
      where: {
        id: { in: taskIds },
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch {
    return {
      message: "خطا در حذف گروهی تسک‌ها",
      success: false,
    };
  }
}

export async function updatedSelectedTaskCategory(
  taskIds: string[],
  categoryId: string
) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser;
  }

  const { user } = currentUser;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return {
        message: "کتگوری انتخاب‌شده معتبر نیست.",
        success: false,
      };
    }

    await prisma.task.updateMany({
      data: {
        categoryId,
      },
      where: {
        id: { in: taskIds },
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch {
    return {
      message: "خطا در تغییر گروهی دسته‌بندی",
      success: false,
    };
  }
}

interface UpdateTaskData {
  categoryId: string | null;
  dueAt: Due;
  isDone: boolean;
  notes: string;
  recurrence: Recurrence;
  subTasks: {
    id: string | null;
    title: string;
    isDone: boolean;
  }[];
  title: string;
}

export async function updateTaskDetails(taskId: string, data: UpdateTaskData) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser;
  }

  try {
    const updatedTask = await prisma.task.updateMany({
      data: {
        categoryId: data.categoryId,
        dueAt: data.dueAt,
        isDone: data.isDone,
        notes: data.notes || null,
        recurrence: data.recurrence,
        title: data.title,
      },
      where: {
        id: taskId,
        userId: currentUser.user.id,
      },
    });

    if (updatedTask.count === 0) {
      return {
        message: "تسک پیدا نشد.",
        success: false,
      };
    }

    const existingSubTasks = await prisma.subTask.findMany({
      select: {
        id: true,
      },
      where: {
        task: {
          userId: currentUser.user.id,
        },
        taskId,
      },
    });

    const submittedIds = data.subTasks
      .map((subTask) => subTask.id)
      .filter((id): id is string => id !== null);

    const idsToDelete = existingSubTasks
      .map((subTask) => subTask.id)
      .filter((id) => !submittedIds.includes(id));

    if (idsToDelete.length > 0) {
      await prisma.subTask.deleteMany({
        where: {
          id: { in: idsToDelete },
          taskId,
        },
      });
    }

    for (const subTask of data.subTasks) {
      if (subTask.id === null) {
        // biome-ignore lint/performance/noAwaitInLoops: Shut the fuck up!
        await prisma.subTask.create({
          data: {
            isDone: subTask.isDone,
            taskId,
            title: subTask.title,
          },
        });
      } else {
        await prisma.subTask.updateMany({
          data: {
            isDone: subTask.isDone,
            title: subTask.title,
          },
          where: {
            id: subTask.id,
            task: {
              userId: currentUser.user.id,
            },
            taskId,
          },
        });
      }
    }

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در ذخیره تغییرات.",
      success: false,
    };
  }
}
