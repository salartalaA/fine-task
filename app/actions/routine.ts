"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/app/actions/user";
import prisma from "@/lib/prisma";

function refreshRoutinePages() {
  revalidatePath("/");
  revalidatePath("/habits");
}

async function getCurrentUser() {
  const result = await requireActiveUser();
  return result.success ? result.user : null;
}

function getDateKey() {
  const timeZone = process.env.APP_TIME_ZONE ?? "Asia/Baku";

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!(year && month && day)) {
    throw new Error("Could not determine the current date.");
  }

  return `${year}-${month}-${day}`;
}

export async function getRoutines() {
  const user = await getCurrentUser();

  if (!user) {
    return { routines: [], success: false as const };
  }

  try {
    const dateKey = getDateKey();

    const routines = await prisma.routine.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        completions: {
          select: { id: true },
          take: 1,
          where: { dateKey },
        },
        id: true,
        isActive: true,
        title: true,
      },
      where: { userId: user.id },
    });

    return {
      routines: routines.map((routine) => ({
        id: routine.id,
        isActive: routine.isActive,
        isDone: routine.completions.length > 0,
        title: routine.title,
      })),
      success: true as const,
    };
  } catch {
    return { routines: [], success: false as const };
  }
}

export async function createRoutineFromForm(formData: FormData) {
  const title = formData.get("title");

  if (typeof title !== "string") {
    return;
  }

  const normalizedTitle = title.trim();

  if (!normalizedTitle || normalizedTitle.length > 80) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    const existing = await prisma.routine.findFirst({
      select: { id: true },
      where: {
        title: { equals: normalizedTitle, mode: "insensitive" },
        userId: user.id,
      },
    });

    if (existing) {
      return;
    }

    await prisma.routine.create({
      data: {
        isActive: false,
        title: normalizedTitle,
        userId: user.id,
      },
    });

    refreshRoutinePages();
  } catch {
    // DB error
  }
}

export async function activateRoutineFromForm(formData: FormData) {
  const routineId = formData.get("routineId");

  if (typeof routineId !== "string" || !routineId) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    await prisma.routine.updateMany({
      data: { isActive: true },
      where: {
        id: routineId,
        isActive: false,
        userId: user.id,
      },
    });

    refreshRoutinePages();
  } catch {
    // DB error
  }
}

export async function createSuggestedRoutine(formData: FormData) {
  const title = formData.get("title");

  if (typeof title !== "string") {
    return;
  }

  const normalizedTitle = title.trim();

  if (!normalizedTitle || normalizedTitle.length > 80) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    const existing = await prisma.routine.findFirst({
      select: { id: true },
      where: {
        title: { equals: normalizedTitle, mode: "insensitive" },
        userId: user.id,
      },
    });

    if (existing) {
      return;
    }

    await prisma.routine.create({
      data: {
        isActive: false,
        title: normalizedTitle,
        userId: user.id,
      },
    });

    refreshRoutinePages();
  } catch {
    // DB error
  }
}

export async function deleteRoutineFromForm(formData: FormData) {
  const routineId = formData.get("routineId");

  if (typeof routineId !== "string" || !routineId) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    await prisma.routine.deleteMany({
      where: {
        id: routineId,
        isActive: false,
        userId: user.id,
      },
    });

    refreshRoutinePages();
  } catch {
    // DB error
  }
}

export async function deactivateRoutineFromForm(formData: FormData) {
  const routineId = formData.get("routineId");

  if (typeof routineId !== "string" || !routineId) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    await prisma.routine.updateMany({
      data: { isActive: false },
      where: {
        id: routineId,
        isActive: true,
        userId: user.id,
      },
    });

    refreshRoutinePages();
  } catch {
    // DB error
  }
}

export async function toggleRoutineCompletionFromForm(formData: FormData) {
  const routineId = formData.get("routineId");

  if (typeof routineId !== "string" || !routineId) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  try {
    const dateKey = getDateKey();

    const routine = await prisma.routine.findFirst({
      select: {
        completions: {
          select: { id: true },
          take: 1,
          where: { dateKey },
        },
        id: true,
      },
      where: {
        id: routineId,
        isActive: true,
        userId: user.id,
      },
    });

    if (!routine) {
      return;
    }

    // biome-ignore lint/style/useDestructuring: Fuck u
    const completion = routine.completions[0];

    if (completion) {
      await prisma.routineCompletion.deleteMany({
        where: {
          id: completion.id,
          routineId: routine.id,
        },
      });
    } else {
      await prisma.routineCompletion.create({
        data: {
          dateKey,
          routineId: routine.id,
        },
      });
    }

    refreshRoutinePages();
  } catch {
    // DB error
  }
}
