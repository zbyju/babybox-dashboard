"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { translateMaintenanceState } from "@/utils/translations/maintenance";
import { BabyboxMaintenance } from "@/types/maintenance.types";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { useAuth } from "../contexts/auth-context";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { babyboxes } from "@/data/babyboxes";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Link from "next/link";
import useSWR from "swr";

interface Props {
  maintenances: BabyboxMaintenance[];
  onDelete: (id: string) => unknown;
}

const Cell = ({ row }: { row: { original: BabyboxMaintenance } }) => {
  const { token } = useAuth();
  const id = row.original.id;
  const { data: issues } = useSWR(
    ["issues/maintenance/" + id, token],
    ([_, token]) => issuesFetcher(token, "/maintenance/" + id),
  );
  const done = (issues || []).filter((i) =>
    ["closed", "solved"].includes(i.state_history.at(0)?.state || "unknown"),
  );
  const count = (issues || []).length;
  const doneCount = done.length;
  const undoneCount = count - doneCount;
  return (
    <div className="text-center">
      <span className="text-blue-700">{undoneCount}</span>/
      <span className="text-green-700">{doneCount}</span>/{count}
    </div>
  );
};

export default function MaintenanceTable(props: Props) {
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
              className={`whitespace-normal border-2 ${borderColor}`}
            >
              <span>{row.original.title}</span>
            </Button>
          </Link>
        );
      },
    },

    {
      accessorKey: "slug",
      header: () => <div className="">Babybox</div>,
      cell: ({ row }) => {
        const slug = row.original.slug;
        const babybox = babyboxes.find((x) => x.slug === slug);
        const name = babybox?.name || slug;
        return <div>{name}</div>;
      },
    },

    {
      accessorKey: "state",
      header: () => <div className="">Stav</div>,
      cell: ({ row }) => {
        return <div>{translateMaintenanceState(row.original.state)}</div>;
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

    {
      accessorKey: "assignee",
      header: () => <div className="">Přiřazeno</div>,
    },

    {
      accessorKey: "id",
      header: () => (
        <div className="whitespace-normal text-center">
          Počet chyb
          <br />
          (otevřených/hotových/celkem)
        </div>
      ),
      cell: Cell,
    },

    {
      accessorKey: "id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex w-full flex-row justify-center">
            {id !== undefined && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-6 w-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Jste jsi opravdu jistí, že chcete smazat tento servis?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tato akce nemůže být navrácena. Pokud určitě chcete
                      odstranit tento záznam o servisu, pak pokračujte kliknutím
                      na tlačítko smazat. Všechny chyby spojené s tímto servisem
                      zůstanou zachovány.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Storno</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive"
                      onClick={() => props.onDelete(id)}
                    >
                      Smazat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <DataTable
        columns={columns}
        sorting={[]}
        data={props.maintenances}
      ></DataTable>
    </div>
  );
}
