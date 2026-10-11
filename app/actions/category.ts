"use server";

import { requireActiveUser } from "@/app/actions/user";
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
