"use client";

import { ThemeToggle } from "./theme-toggle";
import { Bell, Search, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 z-50 flex-shrink-0">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Side - Page Title / Breadcrumb (Optional but recommended) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              SparesFlow • Inventory OS
            </h1>
          </div>
        </div>

        {/* Right Side - Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* GLOBAL SEARCH */}
          {/* <div className="relative hidden md:block w-72">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search materials, indents, branches..."
              className="w-full bg-muted/70 border border-border pl-10 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-muted-foreground transition-all"
            />
          </div> */}

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1.5">
            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* NOTIFICATIONS */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[9px] p-0 font-medium"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <div className="font-medium">
                      Low stock alert: UF921OTKIT120
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mumbai branch • 2 hours ago
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <div className="font-medium">
                      Indent IND-AUTO-003 approved
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pune • Yesterday
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* QUICK SETTINGS */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button> */}

            {/* HELP */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <HelpCircle className="h-4 w-4" />
            </Button> */}
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-8 bg-border mx-2 hidden md:block" />

          {/* USER PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer pl-2">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold">Urvesh Vernekar</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="Urvesh" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                    UV
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
