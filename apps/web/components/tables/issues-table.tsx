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
import {
  BabyboxIssue,
  IssueFilters,
  IssueFiltersSchema,
  IssueState,
} from "@/types/issue.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  colorizeIssueType,
  colorizePriority,
  colorizeSeverity,
} from "@/utils/colorize/issues";
import { BabyboxesContext } from "../contexts/babyboxes-context";
import { translateIssueState } from "@/utils/translations/issue";
import IssueStateSelect from "../forms/issue-state-select";
import ToggleSortingButton from "./toggle-sorting-button";
import IssuesTableFilters from "./issues-table-filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeString } from "@/utils/normalize";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { z } from "zod";
import _ from "lodash";

interface Props {
  issues: BabyboxIssue[];
  onUpdate: (issue: BabyboxIssue) => void;
  onDelete: (id: string) => void;
}

interface LocalBabyboxIssue extends BabyboxIssue {
  created_at: Date;
}

const filterIssues = (issues: LocalBabyboxIssue[], filters: IssueFilters) => {
  return issues.filter((issue) => {
    if (
      filters.title &&
      !normalizeString(issue.title).includes(normalizeString(filters.title))
    ) {
      return false;
    }
    if (
      filters.slug &&
      !normalizeString(issue.slug).includes(normalizeString(filters.slug))
    ) {
      return false;
    }
    if (
      (filters.maintenanceFilter === "assigned" && !issue.maintenance_id) ||
      (filters.maintenanceFilter === "not_assigned" && issue.maintenance_id)
    ) {
      return false;
    }
    if (
      filters.status &&
      filters.status.length > 0 &&
      !filters.status.includes(
        issue.state_history.length > 0 ? issue.state_history[0].state : "",
      )
    ) {
      return false;
    }
    if (
      filters.priority &&
      filters.priority.length > 0 &&
      !filters.priority.includes(issue.priority || "")
    ) {
      return false;
    }
    if (
      filters.severity &&
      filters.severity.length > 0 &&
      !filters.severity.includes(issue.severity || "")
    ) {
      return false;
    }
    if (
      filters.type &&
      filters.type.length > 0 &&
      !filters.type.includes(issue.issue.type)
    ) {
      return false;
    }
    if (filters.time) {
      if (filters.time.from && issue.created_at < filters.time.from) {
        return false;
      }
      if (filters.time.to && issue.created_at > filters.time.to) {
        return false;
      }
    }
    return true;
  });
};

export default function IssuesTable(props: Props) {
  const columns: ColumnDef<LocalBabyboxIssue>[] = [
    {
      accessorKey: "title",
      header: () => <div className="">Název</div>,
      cell: ({ row }) => {
        const status = row.original.state_history.at(0)?.state || "unknown";
        const borderColor =
          status === "open"
            ? "border-blue-600"
            : status === "closed"
              ? "border-red-600"
              : status === "in_progress"
                ? "border-purple-600"
                : status === "solved"
                  ? "border-green-600"
                  : "";
        return (
          <div className="flex flex-row items-center gap-1">
            <Link href={`/dashboard/issue/${row.original.id}`}>
              <Button
                variant="outline"
                className={`block h-auto whitespace-normal border-2 ${borderColor}`}
              >
                <span>{row.original.title}</span>
              </Button>
            </Link>
          </div>
        );
      },
    },

    {
      accessorKey: "slug",
      header: () => <div className="">Babybox</div>,
      cell: ({ row }) => {
        const slug = row.original.slug;
        const babybox = babyboxes.find((x) => x.slug === slug);
        const name = babybox?.name || slug;
        return <div>{name}</div>;
      },
    },

    {
      accessorKey: "state_history",
      header: () => <div className="">Status</div>,
      cell: ({ row }) => {
        const state =
          row.original.state_history.length > 0
            ? (row.original.state_history[0] as {
                state: IssueState;
                timestamp: Date;
              })
            : { state: "unknown" as const, timestamp: new Date() };

        return (
          <>
            {row.original.id !== undefined ? (
              <IssueStateSelect
                value={state.state}
                onChange={() => {}}
                onUpdate={(issue) => props.onUpdate(issue)}
                issue={row.original}
              />
            ) : (
              <div>{translateIssueState(state.state)}</div>
            )}
          </>
        );
      },
    },

    {
      accessorKey: "priority",
      header: () => <div className="text-center">Priority</div>,
      cell: ({ row }) => {
        const priority = row.original.priority || "Neuvedena";
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <Badge
              className="max-w-fit text-center"
              style={{ backgroundColor: colorizePriority(priority) }}
            >
              {priority}
            </Badge>
          </div>
        );
      },
    },

    {
      accessorKey: "severity",
      header: () => <div className="text-center">Severity</div>,
      cell: ({ row }) => {
        const severity = row.original.severity || "Neuvedena";
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <Badge
              className="max-w-fit text-center"
              style={{ backgroundColor: colorizeSeverity(severity) }}
            >
              {severity}
            </Badge>
          </div>
        );
      },
    },

    {
      accessorKey: "issue",
      header: () => <div className="text-center">Typ chyby</div>,
      cell: ({ row }) => {
        const issue = row.original.issue;
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <Badge
              className="max-w-fit text-center"
              style={{
                backgroundColor: colorizeIssueType(issue.type),
              }}
            >
              {issue.type} - {issue.subtype}
            </Badge>
          </div>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center gap-1">
            <span className="font-semibold">Vytvořeno</span>
            <ToggleSortingButton column={column} />
          </div>
        );
      },
      cell: ({ row }) => {
        const time = format(row.original.created_at, "dd.MM.yyyy HH:mm");
        return <div>{time}</div>;
      },
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

  const { babyboxes } = useContext(BabyboxesContext);

  const issues: LocalBabyboxIssue[] = (props.issues || []).map((i) => ({
    ...i,
    created_at:
      i.state_history.length > 0
        ? i.state_history[i.state_history.length - 1].timestamp
        : new Date(),
  }));

  const form = useForm<z.infer<typeof IssueFiltersSchema>>({
    resolver: zodResolver(IssueFiltersSchema),
    defaultValues: {
      title: "",
      slug: "",
      maintenanceFilter: "all",
    },
  });

  const filterValues = form.watch();

  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    return filterIssues(issues, filterValues);
  }, [issues, filterValues]);

  return (
    <div>
      <Accordion type="single" collapsible className="mb-2 w-full">
        <AccordionItem value="filter">
          <AccordionTrigger className="text-lg font-medium">
            Filtrovat Chyby
          </AccordionTrigger>
          <AccordionContent className=" px-2">
            <IssuesTableFilters
              form={form}
              onSubmit={() => {}}
              issues={props.issues}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DataTable
        columns={columns}
        sorting={[
          { id: "created_at", desc: true },
          { id: "title", desc: false },
        ]}
        data={filteredIssues}
        showPagination
      />
    </div>
  );
}
