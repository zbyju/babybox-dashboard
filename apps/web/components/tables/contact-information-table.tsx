"use client";

import { BabyboxContact } from "@/types/babybox.types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { NotebookTabs } from "lucide-react";

interface Props {
  contacts: BabyboxContact[];
}

export const columns: ColumnDef<BabyboxContact>[] = [
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
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <div>
          {email ? (
            <a href={"mailto:" + email} className="text-blue-900 underline">
              {email}
            </a>
          ) : (
            <span>Nevyplněno</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="">Telefon</div>,
    cell: ({ row }) => {
      const number = row.original.phone;
      return (
        <div>
          {number ? (
            <a href={"tel:" + number} className="text-blue-900 underline">
              {number}
            </a>
          ) : (
            <span>Nevyplněno</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: () => <div className="">Poznámka</div>,
  },
];

export default function ContactInformationTable(props: Props) {
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
    </div>
  );
}
