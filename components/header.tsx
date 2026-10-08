import { NotepadText } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import { HeaderProfile } from "@/components/home/header-profile";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="flex items-center justify-center">
      <div className="fixed top-3 flex w-full max-w-sm items-center justify-between rounded-full bg-primary/5 p-2 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 p-3 text-primary">
            <NotepadText className="scale-x-[-1]" size={20} />
          </span>
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-sm">{"فاین‌تسک"}</span>
            <Badge className="bg-primary/10 font-semibold text-[10px] text-primary">
              {"مدیریت تسک‌ها"}
            </Badge>
          </div>
        </div>

        <HeaderSearch />

        {/* Profile */}
        <HeaderProfile />
      </div>
    </header>
  );
}
