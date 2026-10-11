"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type RegisterData, registerSchema } from "@/lib/validation/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    register,
  } = useForm<RegisterData>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const onRegisterSubmit = async (newUser: RegisterData) => {
    const result = await registerUser(newUser);

    if (result.field === "email") {
      return toast.error(result.message);
    }

    toast.success("حسابت با موفقیت ساخته شد!");

    router.push("/auth/login");
  };

  return (
    <form onSubmit={handleSubmit(onRegisterSubmit)}>
      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">نام</Label>
          <Input
            autoComplete="off"
            className="p-5"
            id="name"
            placeholder="جان"
            type="text"
            {...register("name")}
          />

          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          ) : null}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input
            autoComplete="off"
            className="p-5"
            dir="ltr"
            id="email"
            placeholder="john@gmail.com"
            type="email"
            {...register("email")}
          />

          {errors.email ? (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          ) : null}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">رمزعبور</Label>
          <div className="relative">
            <Input
              autoComplete="off"
              className="p-5"
              dir="ltr"
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />

            <button
              className="absolute top-1 right-2 rounded-full bg-accent-foreground/10 p-2 text-primary"
              onClick={handleShowPassword}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password ? (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Submit button */}
        <Button
          className="p-5 transition-transform active:scale-[0.96]"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "ثبت‌نام"}
        </Button>
      </div>
    </form>
  );
}
