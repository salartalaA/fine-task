"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginData, loginSchema } from "@/lib/validation/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    register,
  } = useForm<LoginData>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (user: LoginData) => {
    const result = await loginUser(user);

    if (
      result.field === "user-validation" ||
      result.field === "password-validation"
    ) {
      return toast.error(result.message);
    }

    toast.success("خوش آمدید!");
  };

  return (
    <form onSubmit={handleSubmit(onLoginSubmit)}>
      <div className="flex flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{"ایمیل"}</Label>
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
          <Label htmlFor="password">{"رمزعبور"}</Label>
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

            {errors.password ? (
              <p className="mt-2 text-destructive text-xs">
                {errors.password.message}
              </p>
            ) : null}

            <button
              className="absolute top-1 right-2 rounded-full bg-accent-foreground/10 p-2 text-primary"
              onClick={handleShowPassword}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button
          className="p-5 transition-transform active:scale-[0.96]"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "ورود"}
        </Button>
      </div>
    </form>
  );
}
