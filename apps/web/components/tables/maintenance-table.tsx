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
import { BabyboxMaintenance } from "@/types/babybox.types";
import { ColumnDef } from "@tanstack/react-table";
import { FileClock, Trash2 } from "lucide-react";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { format } from "date-fns";

interface Props {
  maintenances: BabyboxMaintenance[];
  onDelete: (id: string) => unknown;
}

export default function MaintenanceTable(props: Props) {
  const columns: ColumnDef<BabyboxMaintenance>[] = [
    {
      accessorKey: "id",
      header: () => <div className="">ID</div>,
    },
    {
      accessorKey: "start",
      header: () => <div className="">Datum</div>,
      cell: ({ getValue }: { getValue: () => unknown }) => {
        return format(getValue() as Date, "dd.MM.yyyy");
      },
    },
    { accessorKey: "assignee", header: () => <div className=""></div> },
    {
      accessorKey: "note",
      header: () => <div className="">Poznámka</div>,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }) => {
        const id = row.getValue("id") as string | undefined;

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
                      Jste jsi opravdu jistí, že chcete smazat tuto chybu?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tato akce nemůže být navrácena. Pokud určitě chcete
                      odstranit tento záznam o chybě, pak pokračujte kliknutím
                      na tlačítko smazat.
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
