import Link from "next/link";
import { ModeToggle } from "./buttons/darkmode-toggle";
import { BabyboxCombo } from "./babybox-combo";
import { Construction, HelpCircle, Home, LogIn, LogOut } from "lucide-react";

export default function Navbar() {

  const links = [
    { href: "/app/babybox", name: "Domů", icon: <Home /> },
    { href: "/app/babybox/maintenance", name: "Servisy", icon: <Construction /> },
    { href: "/app/help", name: "Nápověda", icon: <HelpCircle /> }
  ]

  const linkClass = "flex flex-row items-center gap-1 text-accent-foreground hover:text-primary transition-all duration-500"

  return (
    <nav className="w-screen border-b-slate-100 dark:border-b-slate-800 border-b">
      <div className="flex flex-row justify-start items-center gap-10 py-2 px-[16%]">
        <h1 className="text-xl font-bold h-full">Babybox Dashboard</h1>
        <div className="flex flex-row flex-grow justify-start gap-8">
          {links.map(l => (
            <Link className={linkClass} key={l.href} href={l.href}>
              {l.icon}
              {l.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
          <BabyboxCombo />
          <ModeToggle />
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
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
  )
}
