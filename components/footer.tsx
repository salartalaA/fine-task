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
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  done: number;
  icon: LucideIcon;
  tab: ActiveTab;
  title: string;
  total?: number;
}

const navigationItems: NavigationItem[] = [
  {
    done: 5,
    icon: Calendar,
    tab: "TODAY",
    title: "امروز",
  },
  {
    done: 8,
    icon: Inbox,
    tab: "ALL_TASKS",
    title: "همه",
  },
  {
    done: 0,
    icon: Flame,
    tab: "HABITS",
    title: "عادات",
    total: 10,
  },
  {
    done: 0,
    icon: Clock,
    tab: "TIME_LINE",
    title: "بازه زمانی",
  },
  {
    done: 0,
    icon: CircleCheck,
    tab: "LOGBOOK",
    title: "تاریخچه",
  },
];

type ActiveTab = "TODAY" | "ALL_TASKS" | "HABITS" | "LOGBOOK" | "TIME_LINE";

export default function Footer() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("TODAY");

  const handleChangeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <footer className="flex w-full items-center justify-center">
      <nav className="fixed bottom-3 flex max-w-sm items-center justify-center rounded-full bg-primary/5 p-1.5 backdrop-blur-md">
        {navigationItems.map((navItem) => {
          const Icon = navItem.icon;
          const isActive = activeTab === navItem.tab;

          return (
            <Button
              className="relative bg-transparent p-5 hover:bg-transparent active:scale-[0.96]"
              key={navItem.title}
              // biome-ignore lint/performance/noJsxPropsBind: No performance issue
              onClick={() => handleChangeTab(navItem.tab)}
            >
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
            </Button>
          );
        })}
      </nav>
    </footer>
  );
}
