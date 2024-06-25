"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import { NotificationTemplate } from "@/types/notification.types";
import { Babybox } from "@/components/tables/babyboxes-table";
import { DataTable } from "../components/ui/data-table";
import { Textarea } from "@/components/ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface Props {
  notificationTemplate?: NotificationTemplate;
  onSubmit: (
    notificationTemplate: NotificationTemplate,
  ) => Promise<NotificationTemplate | null>;
}

export default function NotificationTemplateForm(props: Props) {
  const defaultTemplate: NotificationTemplate = {
    scope: "global",
    title: "",
    message: "",
    severity: "medium",
    variable: "",
    comparison: "<",
    value: 0,
    notify_new_error: true,
    streak: 0,
    delay: 0,
    emails: [],
  };
  const [template, setTemplate] = useState<NotificationTemplate>(
    props.notificationTemplate || defaultTemplate,
  );
  const [email, setEmail] = useState<string>("");

  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const selected = babyboxes.find((bb) => bb.slug === template.scope);

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

  const columns: ColumnDef<{ email: string }>[] = [
    {
      accessorKey: "email",
      header: () => <div className="">Email</div>,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }) => {
        const email = row.getValue("email") as string;

        return (
          <div className="flex w-full flex-row justify-center">
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                setTemplate({
                  ...template,
                  emails: template.emails.filter((e) => e != email),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xl">Notifikace pro...</Label>
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Switch
            checked={template.scope === "global"}
            onCheckedChange={(val) =>
              val === true
                ? setTemplate({ ...template, scope: "global" })
                : setTemplate({ ...template, scope: "" })
            }
          />
          <Label>Všechny babyboxy</Label>
        </div>
        {template.scope !== "global" ? (
          <div>
            <Combobox
              values={babyboxes.map((b) => ({
                value: b.slug,
                label: b.name,
              }))}
              selected={
                selected
                  ? { value: selected.slug, label: selected.name }
                  : undefined
              }
              onSelect={(val) =>
                setTemplate({
                  ...template,
                  scope: Array.isArray(val)
                    ? val.length > 0
                      ? val[0]
                      : ""
                    : val,
                })
              }
            />
          </div>
        ) : null}
      </div>

      <Label className="mt-4 text-xl">Informace</Label>

      <div className="flex flex-col gap-2">
        <Label>Název</Label>
        <Input
          value={template.title}
          onChange={(e) => setTemplate({ ...template, title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Zpráva</Label>
        <Textarea
          className="h-[150px]"
          value={template.message}
          onChange={(e) =>
            setTemplate({ ...template, message: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Severita</Label>
        <Select
          value={template.severity}
          onValueChange={(e: "low" | "medium" | "high") =>
            setTemplate({ ...template, severity: e })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vyberte severitu" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Severita</SelectLabel>
              <SelectItem value="low">Nízká</SelectItem>
              <SelectItem value="medium">Střední</SelectItem>
              <SelectItem value="high">Vysoká</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Label className="mt-4 text-xl">Podmínka pro notifikaci</Label>

      <div className="flex flex-row flex-wrap items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Proměnná</Label>
          <Select
            value={template.variable}
            onValueChange={(e) => setTemplate({ ...template, variable: e })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vyberte proměnnou" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Proměnná</SelectLabel>
                <SelectItem value="temperature.inside">
                  Vnitřní teplota
                </SelectItem>
                <SelectItem value="temperature.outside">
                  Venkovní teplota
                </SelectItem>
                <SelectItem value="temperature.casing">
                  Teplota pláště
                </SelectItem>
                <SelectItem value="temperature.top">Horní teplota</SelectItem>
                <SelectItem value="temperature.bottom">
                  Dolní teplota
                </SelectItem>
                <SelectItem value="voltage.in">Vstupní napětí</SelectItem>
                <SelectItem value="voltage.battery">
                  Napětí akumulátoru
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Porovnání</Label>
          <Select
            value={template.comparison}
            onValueChange={(e: "==" | "!=" | "<" | ">" | "<=" | ">=") =>
              setTemplate({ ...template, comparison: e })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vyberte porovnání" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Porovnání</SelectLabel>
                <SelectItem value="==">Rovno ( = )</SelectItem>
                <SelectItem value="!=">Nerovno ( != )</SelectItem>
                <SelectItem value="<">Menší než ( {"<"} )</SelectItem>
                <SelectItem value=">">Větší než ( {">"} )</SelectItem>
                <SelectItem value="<=">
                  Menší nebo rovno než ( {"<="} )
                </SelectItem>
                <SelectItem value=">=">
                  Vetší nebo rovno než ( {">="} )
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
            value={template.value}
            onChange={(e) =>
              setTemplate({
                ...template,
                // @ts-expect-error otherwise can't be deleted
                value: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            min={minmax.min}
            max={minmax.max}
          />
        </div>
      </div>

      <Label className="mt-4 text-xl">Omezení odeslání notifikace</Label>

      <div className="flex flex-row items-center gap-2">
        <Switch
          checked={template.notify_new_error}
          onCheckedChange={(e) =>
            setTemplate({ ...template, notify_new_error: e })
          }
        />
        <Label>Notifikace nové chyby</Label>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Info className="mb-[2px] h-4 w-4 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>
                Pokud přijdou data, které nesplňují podmínku pro notifikaci
                (data jsou v pořádku v rámci této šablony), pak dojde k
                vyresetování časové prodlevy a řady. To znamená, že vždy při
                každé nové chybě se vygeneruje notifikace.
              </p>
              <p>
                Tohle nastavení tedy nemá vliv na data, které jsou vadná pořád
                bez přerušení.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
                    Zadejte čas v minutách, po kterou nebudou chodit nové
                    notifikace z této šablony.
                  </p>
                  <p>0 = časová prodleva bude vypnutá</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Label>Časová prodleva</Label>
          </div>
          <Input
            type="number"
            className="min-w-[100px]"
            value={template.delay}
            onChange={(e) =>
              setTemplate({
                ...template,
                // @ts-expect-error otherwise cant be deleted
                delay: e.target.value === "" ? null : Number(e.target.value),
              })
            }
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
                    Zadejte počet příchozích dat v řadě, které splňují podmínku,
                    pro vygenerování notifikace.
                  </p>
                  <p>
                    Např. při nastavení řady = 3, bude potřeba 3 po sobě jdoucí
                    data, které splňují podmínku, pro odeslání notifikace.
                    notifikace.
                  </p>
                  <p>0 = kontrola řady bude vyplá</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Label>Řada</Label>
          </div>
          <Input
            type="number"
            className="min-w-[100px]"
            value={template.streak}
            onChange={(e) =>
              setTemplate({
                ...template,
                // @ts-expect-error otherwise cant be deleted
                streak: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            min={minmax.min}
            max={minmax.max}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Emaily</Label>
        <DataTable
          columns={columns}
          sorting={[]}
          data={template.emails.map((e) => ({ email: e }))}
        />
        <div className="flex flex-row items-center justify-center gap-2">
          <Input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => {
              if (email.length < 2 || !email.includes("@")) return;
              setTemplate({
                ...template,
                emails: template.emails.concat(email),
              });
              setEmail("");
            }}
          >
            Přidat Email
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={async () => {
            const newTemplate = await props.onSubmit(template);
            if (newTemplate === null) {
              setTemplate(defaultTemplate);
            } else {
              setTemplate(newTemplate);
            }
          }}
        >
          Uložit
        </Button>
      </div>
    </div>
  );
}
