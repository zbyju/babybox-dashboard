"use client";

import { Snapshot } from "@/types/snapshot.types";
import { DataTable } from "../ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { differenceInMinutes, format, parse } from "date-fns";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { calculatePercentageChange } from "@/utils/stats";

const columnVars = [
  { key: "temperature.inside", label: "Vnitřní", key2: "temperature_inside" },
  {
    key: "temperature.outside",
    label: "Venkovní",
    key2: "temperature_outside",
  },
  { key: "temperature.casing", label: "Plášť", key2: "temperature_casing" },
  { key: "temperature.top", label: "Horní", key2: "temperature_top" },
  { key: "temperature.bottom", label: "Dolní", key2: "temperature_bottom" },
  { key: "voltage.in", label: "Vstupní", key2: "voltage_in" },
  { key: "voltage.battery", label: "Baterie", key2: "voltage_battery" },
].map((c) => ({
  accessorKey: c.key,
  header: () => <div className="">{c.label}</div>,
  cell: ({
    getValue,
    table,
    row,
  }: {
    getValue: () => unknown;
    table: Table<Snapshot>;
    row: Row<Snapshot>;
  }) => {
    const val = getValue();
    const str = typeof val === "number" ? val.toFixed(2) : val;

    const currentIndex = row.index;
    const currentValue = row.getValue(c.key2) as number;
    const previousValue =
      currentIndex > 0
        ? (table
            .getRowModel()
            .rows[currentIndex - 1].getValue(c.key2) as number)
        : undefined;

    const percentageChange = previousValue
      ? calculatePercentageChange(previousValue, currentValue)
      : 0;

    const arrow =
      percentageChange > 1 ? (
        <ArrowUpRight size={16} className="text-red-600 dark:text-red-700" />
      ) : percentageChange < -1 ? (
        <ArrowDownRight
          size={16}
          className="text-blue-600 dark:text-blue-700"
        />
      ) : (
        <Minus size={16} className="text-slate-700 dark:text-slate-400" />
      );

    return (
      <div className="flex flex-row flex-wrap items-center gap-0">
        {str as string} {arrow || ""}
      </div>
    );
  },
}));

export const columns: ColumnDef<Snapshot>[] = [
  {
    accessorKey: "timestamp",
    header: () => <div className="">Čas</div>,
    cell: ({ row }) => {
      const timestamp = format(
        parse(row.getValue("timestamp"), "yyyy-MM-dd HH:mm:ss", new Date()),
        "d.M.yy HH:mm",
      );
      return <div className="">{timestamp}</div>;
    },
  },
  ...columnVars,
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const d = parse(
        row.getValue("timestamp"),
        "HH:mm:ss dd-MM-yyyy",
        new Date(),
      );
      const now = new Date();
      if (differenceInMinutes(now, d) >= 12) {
        return (
          <div className="text-center">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="default"
                    className="mx-auto bg-destructive text-destructive-foreground hover:bg-destructive"
                  >
                    Error
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Data nepřišla - poslední záznam je více než 12 minut starý.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }

      return (
        <div className="text-center">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="default"
                  className="bg-success text-success-foreground hover:bg-success"
                >
                  OK
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data přišla včas a nebyl v nich nalezen žádný problém.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    meta: {
      align: "center",
    },
  },
];

export default function LatestSnapshots({
  snapshots,
  take,
}: {
  snapshots: Snapshot[];
  take?: number;
}) {
  const snapshotsFirst = snapshots.slice(0, take || 5);

  return (
    <div>
      <DataTable
        columns={columns}
        data={snapshotsFirst}
        sorting={[]}
        className="ghost"
      />
    </div>
  );
}
