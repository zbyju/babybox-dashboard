import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  column: Column<any, unknown>;
}

export default function ToggleSortingButton({ column }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <ArrowUpDown />
    </Button>
  );
}
