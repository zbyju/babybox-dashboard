"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sorting: SortingState;
  hideColumns?: string[];
  showPagination?: boolean;
  filterColumnName?: string;
  rowClassNameAccessor?: (row: Row<TData>) => string;
  rowClickAccessor?: (row: Row<TData>) => unknown;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting: defaultSorting,
  filterColumnName,
  showPagination,
  rowClassNameAccessor,
  rowClickAccessor,
  className = "",
  hideColumns = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {filterColumnName ? (
        <div className="flex items-center py-4">
          <Input
            placeholder="Vyhledejte Babybox..."
            value={
              (table.getColumn(filterColumnName)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(filterColumnName)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      ) : null}
      <div className={"overflow-hidden rounded-md border" + " " + className}>
        <Table className="overflow-x-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter((cell) => {
                    return !hideColumns.includes(cell.column.id);
                  })
                  .map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-hidden">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    (rowClassNameAccessor ? rowClassNameAccessor(row) : "") +
                    (rowClickAccessor ? " cursor-pointer" : "") +
                    " border-b-0 border-t-0"
                  }
                  onClick={() => rowClickAccessor && rowClickAccessor(row)}
                >
                  {row
                    .getVisibleCells()
                    .filter((cell) => {
                      return !hideColumns.includes(cell.column.id);
                    })
                    .map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Žádné data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end gap-2 space-x-2 py-2">
          <span>
            Strana: {table.getState().pagination.pageIndex + 1}/
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Předchozí
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Další
          </Button>
        </div>
      )}
    </>
  );
}
