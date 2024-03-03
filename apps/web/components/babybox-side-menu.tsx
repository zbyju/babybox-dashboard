"use client";

import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Bell,
  BellDot,
  Cable,
  Fan,
  FilePenLine,
  Info,
  LineChart,
  List,
  Thermometer,
} from "lucide-react";
import { BabyboxesContext } from "./contexts/babyboxes-context";
import type { BabyboxBase } from "@/types/babybox.types";
import { Separator } from "./ui/separator";
import { useContext } from "react";
import Link from "next/link";

interface Props {
  babybox: BabyboxBase;
}

export default function BabyboxSideMenu(props: Props) {
  const babyboxes = useContext(BabyboxesContext);
  const currentIdx = babyboxes.findIndex((b) => b.slug === props.babybox.slug);
  const prevSlug =
    babyboxes[(currentIdx - 1 + babyboxes.length) % babyboxes.length].slug;
  const nextSlug = babyboxes[(currentIdx + 1) % babyboxes.length].slug;

  const linkGroups = [
    {
      group: "Obecné",
      links: [
        {
          href: "/app/babybox/" + props.babybox.slug + "/detail",
          text: "Informace",
          icon: <Info />,
        },
        { href: "/app/babybox", text: "Editovat", icon: <FilePenLine /> },
      ],
    },
    {
      group: "Grafy",
      links: [
        {
          href: "/app/babybox/" + props.babybox.slug + "/chart",
          text: "Vše",
          icon: <LineChart />,
        },
        { href: "/app/babybox", text: "Teploty", icon: <Thermometer /> },
        { href: "/app/babybox", text: "Napětí", icon: <Cable /> },
      ],
    },
    {
      group: "Analýza",
      links: [
        { href: "/app/babybox", text: "Akumulátor", icon: <BatteryCharging /> },
        { href: "/app/babybox", text: "Větráky", icon: <Fan /> },
      ],
    },
    {
      group: "Notifikace",
      links: [
        { href: "/app/babybox", text: "Přehled", icon: <Bell /> },
        { href: "/app/babybox", text: "Nastavení", icon: <BellDot /> },
      ],
    },
  ];

  const navigationLinks = [
    { href: "/app/babybox", text: "Seznam", icon: <List /> },
    {
      href: "/app/babybox/" + prevSlug,
      text: "Předchozí",
      icon: <ArrowLeft />,
    },
    { href: "/app/babybox/" + nextSlug, text: "Další", icon: <ArrowRight /> },
  ];

  return (
    <nav className="fixed left-0 z-0 flex w-[16%] min-w-[195px] flex-col overflow-y-auto rounded-r-xl border border-border bg-background pb-3">
      <div className="sticky top-0 mt-2 flex flex-col items-start justify-start gap-2">
        <h2 className="ml-2 mt-1 text-wrap text-xl font-bold capitalize">
          <span className="text-pink-600 dark:text-pink-700">Babybox </span>
          {props.babybox.name}
        </h2>
        <Separator className="my-1" />
        {linkGroups.map((group) => (
          <div key={group.group} className="w-full">
            <h3 className="my-1 ml-2 text-lg font-semibold">{group.group}</h3>
            {group.links.map((link) => (
              <Link
                key={link.text}
                className="flex w-full flex-row items-center gap-2 rounded px-8 py-2 text-sm transition-all duration-500 hover:bg-secondary hover:text-secondary-foreground"
                href={link.href}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>
        ))}

        <Separator className="my-1" />

        <h3 className="mb-1 ml-2 text-lg font-semibold">
          Navigace mezi Babyboxy
        </h3>
        <div className="w-full">
          {navigationLinks.map((link) => (
            <Link
              key={link.text}
              className={
                "flex flex-grow items-center gap-2 rounded px-8 py-1 text-sm transition-all duration-500 hover:bg-secondary hover:text-secondary-foreground"
              }
              href={link.href}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
