"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import type { LoginData, RegisterData } from "@/lib/validation/auth";

export async function registerUser(data: RegisterData) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    return {
      field: "email",
      message: "این ایمیل قبلا ثبت شده است!",
      success: false,
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
    },
  });

  return { success: true };
}

export async function loginUser(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return {
      field: "user-validation",
      message: "اطلاعات وارد شده معتبر نیستند.",
      success: false,
    };
  }

  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

  if (!isPasswordCorrect) {
    return {
      field: "password-validation",
      message: "اطلاعات وارد شده معتبر نیستند.",
      success: false,
    };
  }

  const sessionId = crypto.randomUUID();

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      expiresAt: expires,
      id: sessionId,
      userId: user.id,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("session", sessionId, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    success: true,
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({
      where: {
        id: session.id,
      },
    });

    return;
  }

  return session.user;
}

export async function requireActiveUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      reason: "UNAUTHORIZED",
      success: false,
    } as const;
  }

  return {
    success: true,
    user: currentUser,
  } as const;
}

export async function logout() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }

  cookieStore.delete("session");

  redirect("/auth/login");
}

export async function deleteAccount(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const hasPermission = currentUser.id === userId;

  if (!hasPermission) {
    return;
  }

  await prisma.user.delete({
    where: {
      id: currentUser.id,
    },
  });

  revalidatePath("/auth/register");
}

export async function allActiveUsers() {
  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return currentUser.user;
  }

  return await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
}
