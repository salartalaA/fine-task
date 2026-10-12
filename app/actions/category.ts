"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { requireActiveUser } from "@/app/actions/user";
import type { Category } from "@/components/home/task-properties/task-categories";
import prisma from "@/lib/prisma";

export async function getAllCategories() {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده.",
      success: false,
    };
  }

  const { user } = currentUser;

  const allCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
  });

  return allCategories;
}

export async function createCategory(newCategory: Category["value"]) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده.",
      success: false,
    };
  }

  const { user } = currentUser;

  try {
    const validatedCategory = z.string().trim().min(1).safeParse(newCategory);

    if (!validatedCategory.success) {
      return {
        message: "نام دسته‌بندی معتبر نیست.",
        success: false,
      };
    }

    const { data } = validatedCategory;

    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        value: data,
      },
    });

    if (existingCategory) {
      return {
        message: "این دسته‌بندی در لیست وجود دارد.",
        success: false,
      };
    }

    await prisma.category.create({
      data: {
        userId: user.id,
        value: data,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در ایجاد دسته‌بندی",
      success: false,
    };
  }
}

export async function updateCategory(updatedCategory: Category) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده.",
      success: false,
    };
  }

  const { user } = currentUser;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: updatedCategory.id,
        userId: user.id,
      },
    });

    if (!existingCategory) {
      return {
        message: "این دسته‌بندی وجود ندارد.",
        success: false,
      };
    }

    await prisma.category.update({
      data: {
        value: updatedCategory.value,
      },
      where: {
        id: updatedCategory.id,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در به‌روزرسانی دسته‌بندی",
      success: false,
    };
  }
}

export async function deleteCategory(categoryId: string) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return {
      message: "احراز هویت نشده.",
      success: false,
    };
  }

  const { user } = currentUser;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!existingCategory) {
      return {
        message: "این دسته‌بندی وجود ندارد",
        success: false,
      };
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch {
    return {
      message: "خطا در حذف دسته‌بندی",
      success: false,
    };
  }
}
