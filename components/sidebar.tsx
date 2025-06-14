'use client';

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, LogOut, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode_toogle";
import { navItems } from "@/const";
import { logOut } from "@/actions/auth"; // ✅ Import logout server action

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logOut();
      router.push("/"); // ✅ Redirect to login/root after logout
    });
  };

  return (
    <div className={`bg-background relative h-screen ${open ? "w-56" : "w-20"} transition-all duration-800`}>
      <div className="flex items-center justify-between px-2 py-4">
        <span className="text-lg md:text-xl font-bold">{open ? "Control Panel" : "CP"}</span>
        <div
          className="rounded-full p-2 shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] bg-background text-primary cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </div>
      </div>
      <Separator />
      <nav className="mt-4 space-y-3 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                `flex items-center px-2 py-2 text-sm rounded-md hover:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] hover:dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] duration-300 transition-all hover:text-accent-foreground`,
                isActive
                  ? "shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-4 mr-3" />
              {open && <span>{item.name}</span>}
            </Link>
          );
        })}
        <ModeToggle />
      </nav>
      <div className="absolute bottom-0 w-full p-4 space-y-6">
        <Separator />
        <Button onClick={handleLogout} disabled={isPending} className="flex items-center text-sm">
          {isPending ? (
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5 mr-3" />
          )}
          {open && "Logout"}
        </Button>
      </div>
    </div>
  );
};
