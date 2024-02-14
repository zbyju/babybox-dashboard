import Link from "next/link";
import { ModeToggle } from "./darkmode-toggle";
import { BabyboxCombo } from "./babybox-combo";

export default function Navbar() {

  const links = [
    { href: "/", name: "Domů" },
    { href: "/maintenance", name: "Servisy" },
    { href: "/help", name: "Nápověda" }
  ]

  const linkClass = "text-accent-foreground hover:text-primary transition-all duration-500"

  return (
    <nav className="flex flex-row justify-start items-center py-2 border-b-slate-100 dark:border-b-slate-800 border-b px-[10%] gap-4">
      <h1 className="text-xl font-bold h-full">Babybox Dashboard</h1>
      <div className="flex flex-row flex-grow justify-start gap-4">
        {links.map(l => <Link className={linkClass} key={l.href} href={l.href}>{l.name}</Link>)}
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <BabyboxCombo />
        <ModeToggle />
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <Link href="/auth/login" className={linkClass}>Login</Link>
        <Link href="/auth/logout" className={linkClass}>Logout</Link>
      </div>
    </nav>
  )
}
