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
import { translateEvent } from "@/utils/events";

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
  {
    accessorKey: "event",
    header: () => <div className="">Událost</div>,
    cell: ({ getValue }: { getValue: any }) => {
      const val = getValue();
      const label = translateEvent(val);
      return <div className="">{label as string}</div>;
    },
  },
];

export default function LatestEvents({
  events,
  take,
}: {
  events: Snapshot[];
  take?: number;
}) {
  const eventsFirst = events.slice(0, take || 5);

  return (
    <div>
      <DataTable
        columns={columns}
        data={eventsFirst}
        sorting={[]}
        className="ghost"
      />
    </div>
  );
}
