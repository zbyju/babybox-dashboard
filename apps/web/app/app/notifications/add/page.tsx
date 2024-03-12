"use client";
import { BabyboxCombo } from "@/components/babybox-combo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Equal, EqualNot, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
  const [global, setGlobal] = useState<boolean>(true);

  function minmaxValueBasedOnVariable(variable: string): {
    min: number;
    max: number;
  } {
    switch (variable) {
      case "inside":
        return { min: -50, max: 100 };
      case "outside":
        return { min: -100, max: 100 };
      case "casing":
        return { min: -50, max: 100 };
      case "heating":
        return { min: -100, max: 100 };
      case "cooling":
        return { min: -100, max: 100 };
      case "in":
        return { min: -20, max: 25 };
      case "battery":
        return { min: -20, max: 25 };
      default:
        return { min: -100, max: 100 };
    }
  }

  const minmax = minmaxValueBasedOnVariable("inside");

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Nová notifikační šablona</h2>
        <Link href="/app/notifications">
          <Button
            className="flex flex-row items-center justify-between gap-1"
            variant="secondary"
          >
            <ArrowLeft />
            Zpět
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xl">Notifikace pro...</Label>
          <div className="flex flex-row flex-wrap items-center gap-2">
            <Switch
              checked={global}
              onCheckedChange={(val) => setGlobal(val)}
            />
            <Label>Všechny babyboxy</Label>
          </div>
          {global === false ? (
            <div>
              <BabyboxCombo />
            </div>
          ) : null}
        </div>

        <Label className="mt-4 text-xl">Informace</Label>

        <div className="flex flex-col gap-2">
          <Label>Název</Label>
          <Input />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Zpráva</Label>
          <Textarea className="h-[150px]" />
        </div>

        <Label className="mt-4 text-xl">Podmínka pro notifikaci</Label>

        <div className="flex flex-row flex-wrap items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label>Proměnná</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vyberte proměnnou" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Proměnné</SelectLabel>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="inside">Vnitřní teplota</SelectItem>
                  <SelectItem value="outside">Venkovní teplota</SelectItem>
                  <SelectItem value="casing">Teplota pláště</SelectItem>
                  <SelectItem value="heating">Horní teplota</SelectItem>
                  <SelectItem value="cooling">Dolní teplota</SelectItem>
                  <SelectItem value="in">Vstupní napětí</SelectItem>
                  <SelectItem value="battery">Napětí akumulátoru</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Porovnání</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vyberte proměnnou" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Porovnání</SelectLabel>
                  <SelectItem value="status">Rovno ( = )</SelectItem>
                  <SelectItem value="inside">Nerovno ( != )</SelectItem>
                  <SelectItem value="status">Méně než ( {"<"} )</SelectItem>
                  <SelectItem value="inside">Více než ( {">"} )</SelectItem>
                  <SelectItem value="status">
                    Méně nebo rovno než ( {"<="} )
                  </SelectItem>
                  <SelectItem value="inside">
                    Více nebo rovno než ( {">="} )
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Hodnota</Label>
            <Input
              type="number"
              className="w-[100px]"
              min={minmax.min}
              max={minmax.max}
            />
          </div>
        </div>

        <Label className="mt-4 text-xl">Omezení odeslání notifikace</Label>

        <div className="flex flex-row items-center gap-2">
          <Switch />
          <Label>Notifikace nové chyby</Label>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Info className="mb-[2px] h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      Zadejte čas v minutách, po který nebudou chodit nové
                      notifikace z této šablony.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label>Časová prodleva</Label>
            </div>
            <Input
              type="number"
              className="min-w-[100px]"
              min={minmax.min}
              max={minmax.max}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Info className="mb-[2px] h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      Zadejte počet příchozích dat v řadě, které splňují
                      podmínku, pro vygenerování notifikace.
                    </p>
                    <p>
                      Např. při nastavení řady = 3, bude potřeba 3 po sobě
                      jdoucí data, které splňují podmínku, pro odeslání
                      notifikace.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label>Řada</Label>
            </div>
            <Input
              type="number"
              className="min-w-[100px]"
              min={minmax.min}
              max={minmax.max}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button>Uložit</Button>
        </div>
      </div>
    </div>
  );
}
