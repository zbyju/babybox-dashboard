"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BabyboxesContext } from "../contexts/babyboxes-context";
import { differenceInMinutes, format, parse } from "date-fns";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { toSlug } from "@/utils/slug";
import { Badge } from "../ui/badge";
import { useContext } from "react";

export type Babybox = {
  slug: string;
  name: string;
  lastData: {
    timestamp: string;
    voltage: {
      in: number;
      battery: number;
    };
    temperature: {
      inside: number;
      outside: number;
      casing: number;
      top: number;
      bottom: number;
    };
  };
};

export const columns: ColumnDef<Babybox>[] = [
  {
    accessorKey: "slug",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center gap-1">
          <span className="font-semibold">Babybox</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-[0.92rem] font-semibold">
        {getValue() as string}
      </span>
    ),
    sortingFn: (
      rowA: Row<Babybox>,
      rowB: Row<Babybox>,
      columnId: string,
    ): number => {
      const nameA = rowA.getValue(columnId) as string;
      const nameB = rowB.getValue(columnId) as string;
      return nameA.localeCompare(nameB, "cs", { sensitivity: "base" });
    },
    filterFn: (
      row: Row<Babybox>,
      columnId: string,
      filterValue: unknown,
    ): boolean => {
      const a = toSlug(row.getValue(columnId) as string);
      const b = toSlug(filterValue as string);
      return a.includes(b);
    },
  },
  {
    accessorKey: "lastData.temperature.inside",
    header: () => <div className="text-right">Vnitřní [°C]</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.temperature.outside",
    header: () => <div className="text-right">Venkovní [°C]</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.voltage.in",
    header: () => <div className="text-right">Vstup [V]</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.voltage.battery",
    header: () => <div className="text-right">Baterie [V]</div>,
    cell: ({ getValue }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.timestamp",
    header: () => <div className="text-right">Čas dat</div>,
    cell: ({ row }) => {
      const timestamp = format(
        parse(
          row.getValue("lastData_timestamp"),
          "yyyy-MM-dd HH:mm:ss",
          new Date(),
        ),
        "HH:mm dd.MM.yyyy",
      );
      return <div className="text-right">{timestamp}</div>;
    },
  },
  {
    accessorKey: "lastData.status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const d = parse(
        row.getValue("lastData_timestamp"),
        "yyyy-MM-dd HH:mm:ss",
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

      const status = row.getValue("lastData_status");
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

export default function BabyboxesTable() {
  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const router = useRouter();

  function setRowClassName(row: Row<Babybox>): string {
    const _d = parse(
      row.getValue("lastData_timestamp"),
      "yyyy-MM-dd HH:mm:ss",
      new Date(),
    );
    const _now = new Date();
    return "";
  }

  function onRowClick(row: Row<Babybox>) {
    router.push("/dashboard/babybox/" + row.getValue("slug"));
  }

  return (
    <DataTable
      columns={columns}
      data={babyboxes}
      sorting={[{ id: "name", desc: false }]}
      rowClassNameAccessor={setRowClassName}
      rowClickAccessor={onRowClick}
      hideColumns={["slug"]}
      filterColumnName="name"
    />
  );
}
