"use client";

import { decodeEvent, translateEvent } from "@/utils/events";
import { ColumnDef } from "@tanstack/react-table";
import { type Event } from "@/types/event.types";
import { DataTable } from "../ui/data-table";
import { format, parse } from "date-fns";

export const columns: ColumnDef<Event>[] = [
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
    accessorKey: "event_code",
    header: () => <div className="">Událost</div>,
    cell: ({ row }) => {
      const event = decodeEvent(row.original);
      const label = translateEvent(event.event);
      return <div className="">{label as string}</div>;
    },
  },
];

export default function LatestEvents({
  events,
  take,
}: {
  events: Event[];
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
