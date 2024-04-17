"use client";

import { BabyboxContact } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
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
  },
  {
    accessorKey: "phone",
    header: () => <div className="">Telefon</div>,
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
