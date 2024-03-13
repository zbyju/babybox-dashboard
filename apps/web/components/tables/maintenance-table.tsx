"use client";

import { BabyboxMaintenance } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { FileClock } from "lucide-react";
import { format } from "date-fns";

interface Props {
  maintenances: BabyboxMaintenance[];
}

export const columns: ColumnDef<BabyboxMaintenance>[] = [
  {
    accessorKey: "timestamp",
    header: () => <div className="">Datum</div>,
    cell: ({ getValue }: { getValue: () => unknown }) => {
      return format(getValue() as Date, "dd.MM.yyyy");
    },
  },
  {
    accessorKey: "note",
    header: () => <div className="">Poznámka</div>,
  },
];

export default function MaintenanceTable(props: Props) {
  return (
    <div>
      <div className="mb-4 ml-1 flex flex-row flex-wrap items-center gap-1">
        <FileClock />
        <h4 className="text-2xl font-semibold">Historie servisů</h4>
      </div>
      <DataTable
        columns={columns}
        sorting={[]}
        data={props.maintenances}
      ></DataTable>
    </div>
  );
}
