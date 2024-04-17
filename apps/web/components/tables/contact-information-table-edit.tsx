"use client";

import { BabyboxContact } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { NotebookTabs, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface Props {
  contacts: BabyboxContact[];
  onClick: (contacts: BabyboxContact[]) => void;
  onRemove: (id: string) => void;
}

export default function ContactInformationTableEdit(props: Props) {
  const columns: ColumnDef<BabyboxContact>[] = [
    {
      accessorKey: "firstname",
      header: () => <div className="">Jméno</div>,
    },
    {
      accessorKey: "lastname",
      header: () => <div className="">Příjmení</div>,
    },
    {
      accessorKey: "position",
      header: () => <div className="">Role</div>,
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
      cell: ({ getValue}) => {
        const id = getValue() as string;

        return (
          <div className="flex w-full flex-row justify-center">
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() => props.onRemove(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];


  const [contact, setContact] = useState<BabyboxContact>({
    id: uuidv4(),
    firstname: "",
    lastname: "",
    position: "",
    email: "",
    phone: "",
    note: "",
  });


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
            value={contact.firstname}
            onChange={(e) => setContact({ ...contact, firstname: e.target.value })}
            className="h-[30px] w-[150px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Příjmení</Label>
          <Input
            value={contact.lastname}
            onChange={(e) => setContact({ ...contact, lastname: e.target.value })}
            className="h-[30px] w-[150px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Role</Label>
          <Input
            value={contact.position}
            onChange={(e) => setContact({ ...contact, position: e.target.value })}
            className="h-[30px] w-[150px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Email</Label>
          <Input
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="h-[30px] w-[160px] rounded-sm text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Telefon</Label>
          <Input
            type="phone"
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
        <Button size="sm" onClick={() => {
          if(contact.firstname.length > 1 && contact.lastname.length > 1) {
            props.onClick(props.contacts.concat(contact));
            setContact({
              id: uuidv4(),
              firstname: "",
              lastname: "",
              position: "",
              email: "",
              phone: "",
              note: ""
            })
          } else {
            toast.error("Kontakt musí mít vyplněné jméno a příjmení.")
          }}
        }>
          Přidat
        </Button>
      </div>
    </div>
  );
}
