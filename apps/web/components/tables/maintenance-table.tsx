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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

interface Props {
  maintenances: BabyboxMaintenance[];
  onDelete: (id: string) => unknown;
}

export default function MaintenanceTable(props: Props) {
  const columns: ColumnDef<BabyboxMaintenance>[] = [
    {
      accessorKey: "title",
      header: () => <div className="">Název</div>,
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
      accessorKey: "note",
      header: () => <div className="">Poznámka</div>,
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
