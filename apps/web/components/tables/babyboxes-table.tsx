"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ToggleSortingButton from "./toggle-sorting-button";
import { useNearSnapshots } from "@/hooks/snapshot.hooks";
import { ColumnDef, Row } from "@tanstack/react-table";
import { differenceInMinutes, format } from "date-fns";
import { BabyboxBase } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { toSlug } from "@/utils/slug";
import { Badge } from "../ui/badge";

export type Babybox = {
  slug: string;
  name: string;
  fetchStatus: "ok" | "loading" | "error";
  lastData: {
    timestamp: string;
    voltage: {
      in: number | null;
      battery: number | null;
    };
    temperature: {
      inside: number | null;
      outside: number | null;
      casing: number | null;
      top: number | null;
      bottom: number | null;
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
          <ToggleSortingButton column={column} />
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
    cell: ({ getValue, row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.temperature.outside",
    header: () => <div className="text-right">Venkovní [°C]</div>,
    cell: ({ getValue, row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.voltage.in",
    header: () => <div className="text-right">Vstup [V]</div>,
    cell: ({ getValue, row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.voltage.battery",
    header: () => <div className="text-right">Baterie [V]</div>,
    cell: ({ getValue, row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;
      return <div className="text-right">{str as string}</div>;
    },
  },
  {
    accessorKey: "lastData.timestamp",
    header: () => <div className="text-right">Čas dat</div>,
    cell: ({ row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const timestamp = format(
        row.getValue("lastData_timestamp"),
        "HH:mm dd.MM.yyyy",
      );
      return <div className="text-right">{timestamp}</div>;
    },
  },
  {
    accessorKey: "lastData.status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      if (row.original.fetchStatus === "error")
        return <div className="text-right">X</div>;
      if (row.original.fetchStatus === "loading")
        return <Skeleton className="h-4 w-[20px]" />;
      const d = row.getValue("lastData_timestamp") as Date;
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

export default function BabyboxesTable({
  babyboxes,
}: {
  babyboxes: BabyboxBase[];
}) {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useNearSnapshots({
      slugs: babyboxes.map((b) => b.slug),
      limit: 1,
    });

  const defaultData = {
    timestamp: "00:00 01.01.2020",
    voltage: {
      in: 0,
      battery: 0,
    },
    temperature: {
      inside: 0,
      outside: 0,
      casing: 0,
      top: 0,
      bottom: 0,
    },
  };

  if (isLoading || isFetching)
    return <div>Loading snaphots (data) from babyboxes</div>;

  if (isError)
    return (
      <div>
        Error loading snaphots (data) from babyboxes: {JSON.stringify(error)}
      </div>
    );

  const handleRefresh = () => {
    refetch();
  };

  const babyboxesWithData: Babybox[] = babyboxes.map((bb) => {
    if (!data) {
      const status = isLoading ? "loading" : "error";
      return { ...bb, fetchStatus: status, lastData: defaultData };
    }
    const found = data.find((x) => x.slug === bb.slug);
    const status = !found ? "error" : "ok";
    return {
      ...bb,
      fetchStatus: status,
      lastData: found ?? defaultData,
    };
  });

  function onRowClick(row: Row<Babybox>) {
    router.push("/dashboard/babybox/" + row.getValue("slug"));
  }

  return (
    <DataTable
      columns={columns}
      data={babyboxesWithData}
      sorting={[{ id: "name", desc: false }]}
      rowClickAccessor={onRowClick}
      hideColumns={["slug"]}
      filterColumnName="name"
      onRefresh={handleRefresh}
    />
  );
}
