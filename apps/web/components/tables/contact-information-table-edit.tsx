"use client";

import { BabyboxContact } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { NotebookTabs, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Props {
  contacts: BabyboxContact[];
}

function handleRemoveClicked(id: string): void {
  console.log(id);
}

export const columns: ColumnDef<BabyboxContact>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">Jméno</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="">Email</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="">Telefon</div>,
  },
  {
    accessorKey: "note",
    header: () => <div className="">Poznámka</div>,
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">Akce</div>,
    cell: ({ getValue }) => {
      const id = getValue() as string;

      return (
        <div className="flex w-full flex-row justify-center">
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleRemoveClicked(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function ContactInformationTableEdit(props: Props) {
  const [contact, setContact] = useState<BabyboxContact>({
    id: "",
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  function handleAddClicked(): void {
    console.log(contact);
    toast.error("Error when adding");
  }

  return (
    <div>
      <div className="mb-4 ml-1 flex flex-row flex-wrap items-center gap-1">
        <NotebookTabs />
        <h4 className="text-2xl font-semibold">Kontaktní Informace</h4>
      </div>
      <DataTable
        columns={columns}
        sorting={[]}
        data={props.contacts}
      ></DataTable>
      <h6 className="mt-6 text-xl">Přidat kontakt</h6>
      <div className="mt-2 flex flex-row flex-wrap gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Jméno</Label>
          <Input
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            className="h-[30px] w-[150px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Email</Label>
          <Input
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="h-[30px] w-[160px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Telefon</Label>
          <Input
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="h-[30px] w-[100px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Poznámka</Label>
          <Input
            value={contact.note}
            onChange={(e) => setContact({ ...contact, note: e.target.value })}
            className="h-[30px] w-[200px] rounded-sm text-xs"
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-4">
        <Button size="sm" onClick={() => handleAddClicked()}>
          Přidat
        </Button>
      </div>
    </div>
  );
}
