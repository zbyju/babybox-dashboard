"use client"

import Link from "next/link"
import type { BabyboxBase } from "@/types/babybox.types"
import { ArrowLeft, ArrowRight, BatteryCharging, BatteryWarning, Bell, BellDot, Cable, Fan, FilePenLine, Info, LineChart, List, Thermometer } from "lucide-react"
import { Separator } from "./ui/separator"
import { useContext } from "react"
import { BabyboxesContext } from "./contexts/babyboxes-context"

interface Props {
  babybox: BabyboxBase
}

export default function BabyboxSideMenu(props: Props) {

  const babyboxes = useContext(BabyboxesContext)
  const currentIdx = babyboxes.findIndex(b => b.slug === props.babybox.slug)
  const prevSlug = babyboxes[(currentIdx - 1 + babyboxes.length) % babyboxes.length].slug
  const nextSlug = babyboxes[(currentIdx + 1) % babyboxes.length].slug

  const linkGroups = [
    {
      group: "Obecné", links: [
        { href: "/app/babybox", text: "Informace", icon: <Info /> },
        { href: "/app/babybox", text: "Editovat", icon: <FilePenLine /> },
      ]
    },
    {
      group: "Vizualizace", links: [
        { href: "/app/babybox", text: "Vše", icon: <LineChart /> },
        { href: "/app/babybox", text: "Teploty", icon: <Thermometer /> },
        { href: "/app/babybox", text: "Napětí", icon: <Cable /> },
      ]
    },
    {
      group: "Analýza", links: [
        { href: "/app/babybox", text: "Akumulátor", icon: <BatteryCharging /> },
        { href: "/app/babybox", text: "Větřáky", icon: <Fan /> },
      ]
    },
    {
      group: "Notifikace", links: [
        { href: "/app/babybox", text: "Přehled", icon: <Bell /> },
        { href: "/app/babybox", text: "Nastavení", icon: <BellDot /> },
      ]
    },
  ]

  const navigationLinks = [
    { href: "/app/babybox", text: "Seznam", icon: <List /> },
    { href: "/app/babybox/" + prevSlug, text: "Předchozí", icon: <ArrowLeft /> },
    { href: "/app/babybox/" + nextSlug, text: "Další", icon: <ArrowRight /> },
  ]

  return (
    <nav className="flex flex-col w-[16%] min-w-[195px] h-full fixed border border-border overflow-y-auto">
      <div className="flex flex-col justify-start items-start gap-2 mt-2">
        <h2 className="text-xl font-bold mt-1 ml-2 capitalize text-wrap"><span className="text-pink-600 dark:text-pink-700">Babybox</span> {props.babybox.name}</h2>
        <Separator className="my-1" />
        {linkGroups.map(group => (
          <div className="w-full">
            <h3 className="text-lg font-semibold ml-2 my-1">{group.group}</h3>
            {group.links.map(link => (
              <Link className="w-full flex flex-row items-center gap-2 px-8 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground rounded transition-all duration-500" href={link.href}>
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>
        ))}

        <Separator className="my-1" />

        <h3 className="text-lg font-semibold ml-2 mb-1">Navigace mezi Babyboxy</h3>
        <div className="w-full">
          {navigationLinks.map(link => (
            <Link className={"flex flex-grow items-center gap-2 px-8 py-1 text-sm hover:bg-secondary hover:text-secondary-foreground rounded transition-all duration-500"} href={link.href}>
              {link.icon}
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav >
  )
}
