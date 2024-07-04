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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { User } from "@/types/user.types";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  users: User[];
  onDelete: (username: string) => void;
}

export default function UsersTable(props: Props) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: () => <div className="">Uživatelské jméno</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="">Email</div>,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }) => {
        const username = row.getValue("username") as string;

        return (
          <div className="flex w-full flex-row justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-6 w-6">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Jste jsi opravdu jistí, že chcete smazat uživatele:{" "}
                    {username}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce nemůže být navrácena. Pokud určitě chcete
                    odstranit uživatele {username}, pak pokračujte kliknutím na
                    tlačítko smazat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Storno</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive"
                    onClick={() => props.onDelete(username)}
                  >
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  return <DataTable columns={columns} sorting={[]} data={props.users} />;
}
