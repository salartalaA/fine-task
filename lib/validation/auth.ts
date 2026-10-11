import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .email("لطفا ایمیل خود را وارد کنید")
    .trim()
    .toLowerCase()
    .max(70, "تعداد کرکترهای مجاز: ۷۰ کرکتر"),
  name: z.string().trim().min(1, "لطفا نام خود را وارد کنید"),
  password: z.string().trim().min(8, "رمزعبور باید حداقل ۸ کرکتر باشد"),
});

export const loginSchema = z.object({
  email: z
    .email("لطفا ایمیل خود را وارد کنید")
    .trim()
    .toLowerCase()
    .max(50, "تعداد کرکترهای مجاز: ۵۰ کرکتر"),

  password: z.string().trim().min(8, "لطفا رمزعبور خود را وارد کنید"),
});

export type RegisterData = z.infer<typeof registerSchema>;

export type LoginData = z.infer<typeof loginSchema>;
