"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form>
      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{"نام"}</Label>
          <Input className="p-5" id="name" placeholder="جان" type="text" />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{"ایمیل"}</Label>
          <Input
            className="p-5"
            dir="ltr"
            id="email"
            placeholder="john@gmail.com"
            type="email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{"رمزعبور"}</Label>
          <div className="relative">
            <Input
              className="p-5"
              dir="ltr"
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
            />
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
        <Button className="p-5 transition-transform active:scale-[0.96]">
          {"ثبت‌نام"}
        </Button>
      </div>
    </form>
  );
}
