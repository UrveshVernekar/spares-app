"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shuffle,
  Settings,
  BarChart2,
  Inbox,
  Users,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Pool Management",
    href: "/pool",
    icon: Shuffle,
  },
  // {
  //   name: "Spares Replenishment",
  //   href: "/spares",
  //   icon: Package,
  // },
  {
    name: "Inventory Flow",
    href: "/inventory",
    icon: Inbox,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  // {
  //   name: "Users",
  //   href: "/users",
  //   icon: Users,
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex-shrink-0 border-r border-border bg-card/95 backdrop-blur-xl h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out relative z-50",
          isCollapsed ? "w-16" : "w-72",
        )}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1.5 text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg transition-all z-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo Section */}
        <div className="h-16 flex items-center border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  SparesFlow
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1 tracking-widest">
                  INVENTORY OS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-3">
          <div
            className={cn(
              "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-3 transition-all",
              isCollapsed && "opacity-0 h-0 overflow-hidden",
            )}
          >
            Core Operations
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              const linkContent = (
                <div
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                    isCollapsed
                      ? "justify-center py-3 px-2"
                      : "gap-3 px-4 py-3",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "group-hover:text-foreground",
                    )}
                  />

                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}

                  {isActive && !isCollapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 ml-auto" />
                  )}
                </div>
              );

              return isCollapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className="block">
                      {linkContent}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-sm">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.name} href={item.href} className="block">
                  {linkContent}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Section (Optional - can be extended later) */}
        <div className="border-t border-border p-4">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground px-3">
              v2.4.1 • Goa Region
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
