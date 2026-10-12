import z from "zod";

export const createTaskSchema = z.object({
  category: z.object({
    id: z.string(),
    value: z.string(),
  }),

  dueAt: z.enum(["TODAY", "TOMORROW", "AFTER_TOMORROW"]),

  notes: z.string().trim().max(200).optional(),

  recurrence: z.enum(["ONE_TIME", "DAILY", "WEEKLY", "MONTHLY"]),

  subTasks: z
    .array(
      z
        .object({
          title: z
            .string()
            .trim()
            .max(200, "عنوان ساب‌تسک حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),
        })
        .optional()
    )
    .max(50, "حداکثر ۵۰ ساب‌تسک مجاز است")
    .optional(),

  title: z
    .string()
    .trim()
    .min(1, "عنوان تسک را وارد کنید")
    .max(80, "حداکثر ۸۰ کرکتر"),
});

export const createSubTaskSchema = z.object({
  taskId: z.string().min(1, "شناسه تسک معتبر نیست"),

  title: z
    .string()
    .trim()
    .min(1, "عنوان ساب‌تسک را وارد کنید")
    .max(200, "عنوان ساب‌تسک حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),
});

export type CreateTaskData = z.infer<typeof createTaskSchema>;

export type CreateSubTaskData = z.infer<typeof createSubTaskSchema>;
