import { NotificationTemplate } from "@/types/notification.types";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { Row } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

interface Props {
  templates: NotificationTemplate[];
  onRemove: (id: string) => void;
}

export default function NotificationTemplateTable(props: Props) {
  const columns: ColumnDef<NotificationTemplate>[] = [
    {
      accessorKey: "scope",
      header: () => <div className="">Rozsah</div>,
    },
    {
      accessorKey: "title",
      header: () => <div className="">Název</div>,
    },
    {
      accessorKey: "message",
      header: () => <div className="">Zpráva</div>,
    },
    {
      accessorKey: "severity",
      header: () => <div className="">Severita</div>,
    },
    {
      accessorKey: "_id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }: { row: Row<NotificationTemplate> }) => {
        const id = row?.getValue("_id") as string;
        const title = row?.getValue("title") as string;
        const scope = row?.getValue("scope") as string;

        return (
          <div className="flex w-full flex-row justify-center gap-2">
            <Link href={"/dashboard/notifications/" + id + "/edit"}>
              <Button size="icon" className="h-6 w-6">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-6 w-6">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Jste jsi opravdu jistí, že chcete smazat notifikační
                    šablonu: {title}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce nemůže být vrácena. Pokud určitě chcete odstranit
                    šablonu {title}, která je nastavena s rozsahem {scope}, pak
                    pokračujte kliknutím na tlačítko smazat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Storno</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive"
                    onClick={() => props.onRemove(id)}
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

  return (
    <DataTable
      data={props.templates}
      columns={columns}
      filterColumnName="scope"
      sorting={[
        { id: "scope", desc: false },
        { id: "title", desc: false },
      ]}
    />
  );
}
