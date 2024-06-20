"use client";

import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
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
import { BabyboxIssue } from "@/types/babybox.types";

interface Props {
  issues: BabyboxIssue[];
  onDelete: (id: string) => void;
}

export default function UsersTable(props: Props) {
  const columns: ColumnDef<BabyboxIssue>[] = [
    {
      accessorKey: "slug",
      header: () => <div className="">Babybox</div>,
    },
    {
      accessorKey: "timestamp",
      header: () => <div className="">Datum</div>,
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
  return <DataTable columns={columns} sorting={[]} data={props.issues} />;
}
