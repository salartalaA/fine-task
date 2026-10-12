"use client";

import { LogOut, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { logout } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HeaderProfile({ userEmail }: { userEmail: string }) {
  const [openState, setOpenState] = useState(false);

  const handleLogOut = async () => {
    await logout();
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <DialogTrigger
        render={
          <button type="button">
            <Image
              alt="profile"
              className="size-11! rounded-full"
              height={44}
              src={"/cat.jpg"}
              width={44}
            />
          </button>
        }
      />
      <DialogContent
        className="max-w-sm! bg-primary/5 ring-primary/10 backdrop-blur-md"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className={"flex items-center gap-2"}>
            <Sparkles className="fill-yellow-600 text-yellow-600" size={20} />
            {"پروفایل شخصی"}
          </DialogTitle>

          <X onClick={() => setOpenState(false)} size={20} />
        </DialogHeader>

        <Card className="rounded-md border border-primary/10 bg-primary/5 py-3">
          <CardContent className="flex items-center gap-3 px-4">
            <Image
              alt="profile"
              className="size-11! rounded-sm"
              height={44}
              src={"/cat.jpg"}
              width={44}
            />

            <div className="flex flex-col gap-1 font-semibold">
              <h3>Meow</h3>
              <p className="text-muted-foreground text-xs">
                {`با ایمیل ${userEmail} وارد شدی`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* <div className="flex items-center gap-2"> */}
        {/* <div className="flex-1 rounded-sm border border-primary/10 bg-primary/5 p-2">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Flame className="fill-destructive" size={20} />
              <h3 className="font-semibold text-xs">
                {"روتین روزانه انجام شده"}
              </h3>
            </div>

            <p className="mt-2 text-center font-semibold">{"4"}</p>
          </div> */}

        {/* <div className="flex-1 rounded-sm border border-primary/10 bg-primary/5 p-2">
          <div className="flex items-center justify-center gap-1 text-emerald-500">
            <CircleCheck size={20} />
            <h3 className="font-semibold text-xs">{"تسک‌های انجام شده"}</h3>
          </div>

          <p className="mt-2 text-center font-semibold">{"5"}</p>
        </div> */}
        {/* </div> */}

        <DialogFooter>
          <Button
            className={"w-full rounded-sm bg-destructive/20 p-5"}
            onClick={handleLogOut}
            variant={"destructive"}
          >
            <LogOut className="scale-x-[-1]" />
            {"خروج"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
