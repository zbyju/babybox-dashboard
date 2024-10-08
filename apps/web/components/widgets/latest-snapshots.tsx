"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { calculatePercentageChange } from "@/utils/stats";
import { Snapshot } from "@/types/snapshot.types";
import { DataTable } from "../ui/data-table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

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
            .rows[currentIndex - 1]?.getValue(c.key2) as number)
        : undefined;

    const percentageChange =
      previousValue && currentValue
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
      <div className="flex flex-row items-center gap-0">
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
      const timestamp = format(row.getValue("timestamp"), "d.M.yy HH:mm");
      return <div className="">{timestamp}</div>;
    },
  },
  ...columnVars,
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == 1) {
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
                  <p>Data nepřišla - status = 1.</p>
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
  showPagination,
}: {
  snapshots: Snapshot[];
  take?: number;
  showPagination?: boolean;
}) {
  const snapshotsFirst = snapshots.slice(0, take || 5);

  return (
    <div>
      <DataTable
        columns={columns}
        data={snapshotsFirst}
        sorting={[]}
        className="ghost"
        showPagination={showPagination === true}
      />
    </div>
  );
}
