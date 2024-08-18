import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@radix-ui/react-alert-dialog";
import { translateMaintenanceState } from "@/utils/translations/maintenance";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { maintenancesFetcher } from "@/fetchers/maintenance.fetcher";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { MapPin, Copy, Construction, Trash2 } from "lucide-react";
import { BabyboxMaintenance } from "@/types/maintenance.types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "./contexts/auth-context";
import { ColumnDef } from "@tanstack/react-table";
import OptionalRender from "./optional-render";
import { DataTable } from "./ui/data-table";
import { addYears, format } from "date-fns";
import { Button } from "./ui/button";
import Link from "next/link";
import useSWR from "swr";

interface Props {
  slug: string;
}

export default function MaintenanceInformation({ slug }: Props) {
  const { token } = useAuth();
  const { data: maintenances } = useSWR(
    ["maintenaces/slug/" + slug, token],
    ([_, token]) => maintenancesFetcher(token, slug),
  );

  const lastDoneMaintenance = maintenances
    ?.filter((m) => m.state === "completed")
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .at(0);

  const columns: ColumnDef<BabyboxMaintenance>[] = [
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
              className={`border-2 py-6 ${borderColor}`}
            >
              <span className="my-4 whitespace-normal">
                {row.original.title}
              </span>
            </Button>
          </Link>
        );
      },
    },

    {
      accessorKey: "start",
      header: () => <div className="">Datum</div>,
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
  ];

  return (
    <Card className="w-[450px] max-w-full">
      <CardHeader>
        <CardTitle>
          <span className="flex flex-row items-center gap-2">
            <Construction /> Servisy
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col pl-1">
          {lastDoneMaintenance && (
            <>
              <span>
                Poslední servis byl proveden{" "}
                {format(lastDoneMaintenance?.start, "dd. MM. yyyy")}
              </span>
              <span className="mb-4">
                Další servis by měl být proveden:{" "}
                {format(addYears(lastDoneMaintenance.start, 2), "MM/yy")}
              </span>
            </>
          )}
          <DataTable
            columns={columns}
            sorting={[]}
            data={
              maintenances?.sort((a, b) => {
                return b.start.getTime() - a.start.getTime();
              }) || []
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
