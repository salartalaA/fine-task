import { ArrowLeft, Heart, NotepadText } from "lucide-react";
import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/60">
      <Card className="relative w-full max-w-sm border border-primary/20 bg-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-3 font-semibold text-xl">
            <span className="rounded-md bg-accent-foreground/10 p-3 text-primary">
              <NotepadText className="scale-x-[-1]" size={24} />
            </span>
            {"ساخت حساب کاربری"}
          </CardTitle>
          <CardDescription className="font-bold text-xs">
            {"با فاین‌تسک روزای مطمئن داشته باش"}
          </CardDescription>
          <Badge className="absolute bg-primary/10 p-3 text-primary">
            {"جریان شخصی"}
          </Badge>
        </CardHeader>
        <CardContent>
          <RegisterForm />

          <p className="mt-5 flex items-center justify-center gap-1 text-sm">
            {"قبلاً حساب داری؟"}{" "}
            <Link
              className="flex items-center gap-1 font-semibold text-primary text-xs"
              href="/auth/login"
            >
              {"وارد شو"} <ArrowLeft size={16} />
            </Link>
          </p>
        </CardContent>
        <CardFooter className="mx-auto flex gap-1">
          {"ساخته شده با"}
          <Heart
            className="animate-bounce fill-pink-400 stroke-2 stroke-red-400"
            size={16}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
