"use client";

import { Snapshot } from "@/types/snapshot";
import { DataTable } from "../ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { differenceInMinutes, format, parse } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Snapshot>[] = [
  {
    accessorKey: "timestamp",
    header: () => <div className="">Čas</div>,
    cell: ({ row }) => {
      const timestamp = format(
        parse(row.getValue("timestamp"), "yyyy-MM-dd HH:mm:ss", new Date()),
        "HH:mm",
      );
      return <div className="">{timestamp}</div>;
    },
  },
  {
    accessorKey: "temperature.inside",
    header: () => <div className="text-right">Vnitřní</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "temperature.outside",
    header: () => <div className="text-right">Venkovní</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "voltage.in",
    header: () => <div className="text-right">Vstup</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "voltage.battery",
    header: () => <div className="text-right">Baterie</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
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
