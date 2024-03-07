import { Construction, HelpCircle, Home, LogIn, LogOut } from "lucide-react";
import { ModeToggle } from "./buttons/darkmode-toggle";
import { BabyboxCombo } from "./babybox-combo";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const links = [
    { href: "/app/babybox", name: "Domů", icon: <Home /> },
    {
      href: "/app/babybox/maintenance",
      name: "Servisy",
      icon: <Construction />,
    },
    { href: "/app/help", name: "Nápověda", icon: <HelpCircle /> },
  ];

  const linkClass =
    "flex flex-row items-center gap-1 text-accent-foreground hover:text-primary transition-all duration-500";

  return (
    <>
      <nav className="hidden w-screen border-collapse border-b border-b-slate-100 dark:border-b-slate-800 lg:block">
        <div className="flex flex-row items-center justify-start gap-10 py-2 md:px-4 lg:px-[16%]">
          <h1 className="h-full text-xl font-bold">Babybox Dashboard</h1>
          <div className="flex flex-grow flex-row justify-start gap-8">
            {links.map((l) => (
              <Link className={linkClass} key={l.href} href={l.href}>
                {l.icon}
                {l.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <BabyboxCombo />
            <ModeToggle />
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <Link href="/auth/login" className={linkClass}>
              <LogIn />
              Login
            </Link>
            <Link href="/auth/logout" className={linkClass}>
              <LogOut />
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <nav className="visible fixed bottom-0 z-50 w-screen border-collapse border border-slate-100 bg-background dark:border-slate-800 lg:hidden">
        <div className="flex flex-row items-center justify-start gap-5 px-4 py-2">
          <div className="flex flex-grow flex-row justify-start gap-5">
            {links.map((l) => (
              <Link className={linkClass} key={l.href} href={l.href}>
                <Button size="icon" variant="ghost">
                  {l.icon}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex flex-row items-center justify-between gap-5">
            <ModeToggle />
          </div>
          <div className="flex flex-row items-center justify-between gap-5">
            <Link href="/auth/login" className={linkClass}>
              <LogIn />
            </Link>
            <Link href="/auth/logout" className={linkClass}>
              <LogOut />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
