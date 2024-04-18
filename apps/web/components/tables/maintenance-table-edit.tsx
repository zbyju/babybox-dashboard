"use client";

import { BabyboxMaintenance } from "@/types/babybox.types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { FileClock } from "lucide-react";
import { format } from "date-fns";
import { DatePicker } from "../ui/date-picker";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface Props {
  maintenances: BabyboxMaintenance[];
}

export const columns: ColumnDef<BabyboxMaintenance>[] = [
  {
    accessorKey: "timestamp",
    header: () => <div className="">Datum</div>,
    cell: ({ getValue }: { getValue: () => unknown }) => {
      return format(getValue() as Date, "dd.MM.yyyy");
    },
  },
  {
    accessorKey: "note",
    header: () => <div className="">Poznámka</div>,
  },
];

export default function MaintenanceTableEdit(props: Props) {
  const [maintenance, setMaintenance] = useState<{
    timestamp: Date | undefined;
    note: string;
  }>({ timestamp: new Date(), note: "" });

  function handleAddClicked(): void {
    toast.error("Chyba");
  }

  return (
    <div>
      <div className="mb-4 ml-1 flex flex-row flex-wrap items-center gap-1">
        <FileClock />
        <h4 className="text-2xl font-semibold">Historie servisů</h4>
      </div>
      <DataTable
        columns={columns}
        sorting={[]}
        data={props.maintenances}
      ></DataTable>
      <div></div>
      <h6 className="mt-6 text-xl">Přidat servis</h6>
      <div className="mt-2 flex flex-row flex-wrap gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Jméno</Label>
          <DatePicker
            date={maintenance.timestamp}
            onChange={(val) =>
              setMaintenance({ ...maintenance, timestamp: val })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-muted-foreground">Poznámka</Label>
          <Input
            value={maintenance.note}
            onChange={(e) =>
              setMaintenance({ ...maintenance, note: e.target.value })
            }
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
