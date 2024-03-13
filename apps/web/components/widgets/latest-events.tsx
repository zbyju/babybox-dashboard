"use client";

import { DataTable } from "../ui/data-table";
import { format, parse } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { translateEvent } from "@/utils/events";
import { Snapshot } from "@/types/snapshot.types";

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
    cell: ({ getValue }: { getValue: () => unknown }) => {
      const val = getValue();
      const valStr = typeof val === "string" ? val : "";
      const label = translateEvent(valStr);
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
