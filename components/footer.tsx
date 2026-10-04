"use client";

import {
  Calendar,
  CircleCheck,
  Flame,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: LucideIcon;
  title: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    icon: Calendar,
    title: "امروز",
  },
  {
    href: "/all-tasks",
    icon: Inbox,
    title: "همه",
  },
  {
    href: "/habits",
    icon: Flame,
    title: "عادات",
  },
  {
    href: "/log-book",
    icon: CircleCheck,
    title: "تاریخچه",
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="flex w-full items-center justify-center">
      <nav className="fixed bottom-3 flex max-w-sm items-center justify-center rounded-full bg-primary/5 p-1.5 backdrop-blur-md">
        {navigationItems.map((navItem) => {
          const Icon = navItem.icon;
          const isActive = pathname === navItem.href;

          return (
            <Button
              className="relative bg-transparent p-5 hover:bg-transparent active:scale-[0.96]"
              key={navItem.href}
            >
              <Link href={navItem.href}>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-md border border-primary/20 bg-primary/10"
                    layoutId="active-nav"
                    transition={{
                      damping: 35,
                      stiffness: 500,
                      type: "spring",
                    }}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex flex-col items-center justify-center transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon size={14} />
                  <div className="text-xs">{navItem.title}</div>
                </div>
              </Link>
            </Button>
          );
        })}
      </nav>
    </footer>
  );
}
