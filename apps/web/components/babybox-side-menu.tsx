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
import { Babybox } from "./tables/babyboxes-table";

interface Props {
  babybox: BabyboxBase;
}

export default function BabyboxSideMenu(props: Props) {
  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const currentIdx =
    babyboxes && babyboxes.length > 0
      ? babyboxes.findIndex((b) => b.slug === props.babybox.slug)
      : 0;
  const prevSlug =
    babyboxes && babyboxes.length > 0
      ? babyboxes[(currentIdx - 1 + babyboxes.length) % babyboxes.length].slug
      : props.babybox.slug;
  const nextSlug =
    babyboxes && babyboxes.length > 0
      ? babyboxes[(currentIdx + 1) % babyboxes.length].slug
      : props.babybox.slug;

  const linkGroups = [
    {
      group: "Obecné",
      links: [
        {
          href: "/dashboard/babybox/" + props.babybox.slug + "/detail",
          text: "Informace",
          icon: <Info />,
        },
        {
          href: "/dashboard/babybox/" + props.babybox.slug + "/edit",
          text: "Editovat",
          icon: <FilePenLine />,
        },
      ],
    },
    {
      group: "Grafy",
      links: [
        {
          href:
            "/dashboard/babybox/" +
            props.babybox.slug +
            "/chart?sources=temperature,voltage",
          text: "Vše",
          icon: <LineChart />,
        },
        {
          href:
            "/dashboard/babybox/" +
            props.babybox.slug +
            "/chart?sources=temperature",
          text: "Teploty",
          icon: <Thermometer />,
        },
        {
          href:
            "/dashboard/babybox/" +
            props.babybox.slug +
            "/chart?sources=voltage",
          text: "Napětí",
          icon: <Cable />,
        },
      ],
    },
    {
      group: "Analýza",
      links: [
        {
          href: "/dashboard/babybox",
          text: "Akumulátor",
          icon: <BatteryCharging />,
        },
        { href: "/dashboard/babybox", text: "Větráky", icon: <Fan /> },
      ],
    },
    {
      group: "Notifikace",
      links: [
        { href: "/dashboard/babybox", text: "Přehled", icon: <Bell /> },
        { href: "/dashboard/babybox", text: "Nastavení", icon: <BellDot /> },
      ],
    },
  ];

  const navigationLinks = [
    { href: "/dashboard/babybox", text: "Seznam", icon: <List /> },
    {
      href: "/dashboard/babybox/" + prevSlug,
      text: "Předchozí",
      icon: <ArrowLeft />,
    },
    {
      href: "/dashboard/babybox/" + nextSlug,
      text: "Další",
      icon: <ArrowRight />,
    },
  ];

  return (
    <nav className="z-10 mx-auto block w-full min-w-[200px] flex-col overflow-y-auto rounded-r-xl border border-border bg-background pb-3 lg:fixed lg:left-0 lg:max-h-[75vh] lg:w-[16%]">
      <div className="sticky mt-2 flex flex-col items-start justify-start gap-2">
        <h2 className="ml-2 mt-1 text-wrap text-xl font-bold capitalize">
          <span className="text-pink-600 dark:text-pink-700">Babybox </span>
          {props.babybox.name}
        </h2>
        <Separator className="my-1" />
        <h3 className="mb-1 ml-2 text-lg font-semibold">
          Navigace mezi Babyboxy
        </h3>
        <div className="w-full">
          {navigationLinks.map((link) => (
            <Link
              key={link.text}
              className="flex flex-grow items-center gap-2 rounded px-8 py-1 text-sm transition-all duration-500 hover:bg-secondary hover:text-secondary-foreground"
              href={link.href}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
        </div>

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
      </div>
    </nav>
  );
}
