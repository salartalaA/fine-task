"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/app/actions/user";
import type { Category } from "@/components/home/task-properties/task-categories";
import prisma from "@/lib/prisma";

export async function getAllCategories() {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return null;
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
    return null;
  }

  const { user } = currentUser;

  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: user.id,
      value: newCategory,
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
      value: newCategory,
    },
  });

  revalidatePath("/");
}

export async function updateCategory(updatedCategory: Category) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return null;
  }

  const { user } = currentUser;

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
}

export async function deleteCategory(categoryId: string) {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return null;
  }

  const { user } = currentUser;

  await prisma.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });

  revalidatePath("/");
}
