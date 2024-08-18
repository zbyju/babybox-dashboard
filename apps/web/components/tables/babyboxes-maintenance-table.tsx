import { BabyboxesContext } from "../contexts/babyboxes-context";
import { fetcherMultipleWithToken } from "@/helpers/api-helper";
import { BabyboxMaintenance } from "@/types/maintenance.types";
import ToggleSortingButton from "./toggle-sorting-button";
import { useAuth } from "../contexts/auth-context";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { addYears, format } from "date-fns";
import { Button } from "../ui/button";
import { useContext } from "react";
import Link from "next/link";
import useSWR from "swr";

interface Props {}

export default function BabyboxesMaintenanceTable({}: Props) {
  const { babyboxes, getBabyboxBySlug } = useContext(BabyboxesContext);

  const { token } = useAuth();
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const urls = babyboxes.map(
    (b) => `${babyboxServiceURL}/v1/maintenances/slug/${b.slug}`,
  );
  const { data } = useSWR(urls.length ? [urls, token] : null, ([urls, token]) =>
    fetcherMultipleWithToken(urls, token),
  );

  const latestDoneMaintenances: BabyboxMaintenance[] =
    data
      ?.flatMap((d) =>
        d?.data
          // @ts-expect-error any
          .filter((m) => m.state === "completed")
          // @ts-expect-error any
          .map((m) => ({
            ...m,
            start: new Date(m.start),
            end: new Date(m.end),
          }))
          .sort((a: BabyboxMaintenance, b: BabyboxMaintenance) => {
            return new Date(b.start).getTime() - a.start.getTime();
          })
          .at(0),
      )
      .filter((x) => x) || [];

  const columns: ColumnDef<BabyboxMaintenance>[] = [
    {
      accessorKey: "slug",
      header: () => <div className="">Babybox</div>,
      cell: ({ row }) => {
        const slug = row.original.slug;
        const babybox = getBabyboxBySlug(slug || "");
        const name = babybox?.name || slug;
        return <div>{name}</div>;
      },
    },

    {
      accessorKey: "end",
      header: () => <div className="">Další servis</div>,
      cell: ({ row }) => {
        const start = row.original.start;
        return <div>{format(addYears(start, 2), "MM/yyyy")}</div>;
      },
    },

    {
      accessorKey: "start",
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1">
          Poslední uzavřený servis
          <ToggleSortingButton column={column} />
        </div>
      ),
      cell: ({ row }) => {
        const start = row.original.start;
        const end = row.original.end;
        return (
          <div>
            {format(start, "dd.MM.yyyy")}
            {end && <span> - {format(end, "dd.MM.yyyy")}</span>}
          </div>
        );
      },
    },

    {
      accessorKey: "title",
      header: () => <div className="">Název</div>,
      cell: ({ row }) => {
        const status = row.original.state;
        const borderColor =
          status === "open"
            ? "border-blue-600"
            : status === "completed"
              ? "border-green-600"
              : "";
        return (
          <Link href={`/dashboard/maintenance/${row.original.id}`}>
            <Button
              variant="outline"
              className={`h-auto whitespace-normal border-2 ${borderColor}`}
            >
              <span>{row.original.title}</span>
            </Button>
          </Link>
        );
      },
    },

    {
      accessorKey: "assignee",
      header: () => <div className="">Přiřazeno</div>,
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        sorting={[
          { id: "start", desc: false },
          { id: "slug", desc: true },
        ]}
        data={latestDoneMaintenances}
      ></DataTable>
    </div>
  );
}
