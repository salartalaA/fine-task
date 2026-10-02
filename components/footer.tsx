"use client";

import { cn } from "cn";
import {
  Calendar,
  CircleCheck,
  Clock,
  Flame,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  done: number;
  href: string;
  icon: LucideIcon;
  title: string;
  total?: number;
}

const navigationItems: NavigationItem[] = [
  {
    done: 5,
    href: "/",
    icon: Calendar,
    title: "امروز",
  },
  {
    done: 8,
    href: "/all-tasks",
    icon: Inbox,
    title: "همه",
  },
  {
    done: 0,
    href: "/habits",
    icon: Flame,
    title: "عادات",
    total: 10,
  },
  {
    done: 0,
    href: "/time-line",
    icon: Clock,
    title: "بازه زمانی",
  },
  {
    done: 0,
    href: "/logbook",
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

                {navItem.total !== undefined && (
                  <span className="absolute -top-1 -right-1 z-20 rounded-full bg-primary px-2 text-foreground text-xs">
                    {navItem.total}
                  </span>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>
    </footer>
  );
}
