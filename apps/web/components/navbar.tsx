import {
  Bell,
  CircleEllipsis,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  MessageSquareWarning,
  User,
} from "lucide-react";
import { ModeToggle } from "./buttons/darkmode-toggle";
import { BabyboxCombo } from "./babybox-combo";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./contexts/auth-context";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  const links = [
    { href: "/dashboard/babybox", name: "Domů", icon: <Home /> },
    {
      href: "/dashboard/issues",
      name: "Chyby",
      icon: <MessageSquareWarning />,
    },
  ];

  const otherLinks = [
    { href: "/dashboard/notifications", name: "Notifikace", icon: <Bell /> },
    { href: "/dashboard/users", name: "Uživatelé", icon: <User /> },
    { href: "/dashboard/help", name: "Nápověda", icon: <HelpCircle /> },
  ];

  const linkClass =
    "flex flex-row items-center gap-1 text-accent-foreground hover:text-primary transition-all duration-500";

  return (
    <>
      <nav className="hidden w-screen border-collapse border-b border-b-slate-100 dark:border-b-slate-800 lg:block">
        <div className="flex flex-row items-center justify-start gap-10 py-2 md:px-4 lg:px-[16%]">
          <div className="flex flex-grow flex-row justify-start gap-6">
            {links.map((l) => (
              <Link className={linkClass} key={l.href} href={l.href}>
                {l.icon}
                {l.name}
              </Link>
            ))}
            <Popover>
              <PopoverTrigger className={linkClass}>
                <CircleEllipsis />
                Další
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="mx-auto flex flex-col items-center justify-start gap-4">
                  {otherLinks.map((l) => (
                    <Link
                      className={linkClass + " self-start"}
                      key={l.href}
                      href={l.href}
                    >
                      {l.icon}
                      {l.name}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <BabyboxCombo />
            <ModeToggle />
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            {!isAuthenticated && (
              <Link href="/auth/login" className={linkClass}>
                <LogIn />
                Přihlásit se
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/auth/logout" className={linkClass}>
                <LogOut />
                Odhlásit se
              </Link>
            )}
          </div>
        </div>
      </nav>

      <nav className="mobile-nav visible fixed bottom-0 z-50 w-screen border-collapse border border-slate-100 bg-background dark:border-slate-800 lg:hidden">
        <div className="flex flex-row items-center justify-start gap-2 px-4 py-2">
          <div className="flex flex-grow flex-row justify-start gap-2">
            {links.map((l) => (
              <Link className={linkClass} key={l.href} href={l.href}>
                <Button size="icon" variant="ghost">
                  {l.icon}
                </Button>
              </Link>
            ))}
            <Popover>
              <PopoverTrigger className={linkClass}>
                <CircleEllipsis />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="mx-auto flex flex-col items-center justify-start gap-4">
                  {otherLinks.map((l) => (
                    <Link
                      className={linkClass + " self-start"}
                      key={l.href}
                      href={l.href}
                    >
                      {l.icon}
                      {l.name}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            <ModeToggle />
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            {!isAuthenticated && (
              <Link href="/auth/login" className={linkClass}>
                <LogIn />
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/auth/logout" className={linkClass}>
                <LogOut />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
