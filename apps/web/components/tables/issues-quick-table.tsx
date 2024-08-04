"use client";

import {
  colorizeIssueType,
  colorizePriority,
  colorizeSeverity,
} from "@/utils/colorize/issues";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Ban, CheckCheck, Hammer, PackageOpen } from "lucide-react";
import { BabyboxIssue, IssueState } from "@/types/issue.types";
import { useAuth } from "../contexts/auth-context";
import { updateIssue } from "@/helpers/api-helper";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { KeyedMutator } from "swr";
import { ReactNode } from "react";
import { toast } from "sonner";
import Link from "next/link";
import _ from "lodash";

interface Props {
  issues: BabyboxIssue[];
  mutate?: KeyedMutator<BabyboxIssue[]>;
  smallActions?: boolean;
}

export default function IssuesQuickTable({
  issues,
  mutate,
  smallActions,
}: Props) {
  const { token, user } = useAuth();

  async function quickIssueUpdate(issue: BabyboxIssue, newState: IssueState) {
    if (!user) {
      return;
    }
    const newIssue: BabyboxIssue = {
      ...issue,
      state_history: issue.state_history.toSpliced(0, 0, {
        state: newState,
        timestamp: new Date(),
        username: user.username,
      }),
    };

    try {
      const updatedIssue = await updateIssue(newIssue, token);
      const newIssues = (issues || []).map((i) =>
        i.id === updatedIssue.id ? updatedIssue : i,
      );
      issues && mutate && mutate(newIssues);
      toast.success("Chyba úspěšně aktualizována.");
    } catch (err) {
      toast.error("Nebylo možné aktualizovat chybu.");
    }
  }

  const columns: ColumnDef<BabyboxIssue>[] = [
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
          <Link href={`/dashboard/issue/${row.original.id}`}>
            <div className="flex flex-row flex-wrap items-center gap-2 lg:flex-nowrap">
              <Button
                variant="outline"
                className={
                  "flex h-auto flex-row gap-2 whitespace-normal border-2 " +
                  borderColor
                }
              >
                <span>{row.original.title} </span>
              </Button>
            </div>
          </Link>
        );
      },
    },

    // {
    //   accessorKey: "state_history",
    //   header: () => <div className="text-center">Typ chyby</div>,
    //   cell: ({ row }) => {
    //     const status = row.original.state_history.at(0)?.state || "unknown";
    //     return (
    //       <Badge
    //         className="max-w-fit text-center"
    //         style={{
    //           backgroundColor: colorizeStatus(status),
    //         }}
    //       >
    //         {translateIssueState(status)}
    //       </Badge>
    //     );
    //   },
    // },

    {
      accessorKey: "priority",
      header: () => <div className="text-center">Priorita/Severita</div>,
      cell: ({ row }) => {
        const priority = row.original.priority || "Neuvedena";
        const severity = row.original.severity || "Neuvedena";
        return (
          <div className="flex flex-row flex-wrap justify-center gap-2">
            <div className="flex flex-col items-center justify-center gap-1">
              <Badge
                className="max-w-fit text-center"
                style={{ backgroundColor: colorizePriority(priority) }}
              >
                {priority}
              </Badge>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Badge
                className="max-w-fit text-center"
                style={{ backgroundColor: colorizeSeverity(severity) }}
              >
                {severity}
              </Badge>
            </div>
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
      accessorKey: "id",
      header: () => <div className="text-center">Akce</div>,
      cell: ({ row }) => {
        const state = row.original.state_history.at(0)?.state || "unknown";
        const btnClass = smallActions ? "" : "gap-1 justify-start";
        const btnSize = smallActions ? "icon" : "sm";
        const rowClass =
          "flex flex-row flex-wrap gap-1 " +
          (smallActions ? "" : "lg:flex-col");

        const btn = (
          label: string,
          value: IssueState,
          color: string,
          icon: ReactNode,
          disabled?: boolean,
        ) => {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    disabled={disabled}
                    className={
                      btnClass +
                      ` bg-${color}-500 hover:bg-${color}-400 dark:bg-${color}-600 hover:dark:bg-${color}-700`
                    }
                    size={btnSize}
                    onClick={() => quickIssueUpdate(row.original, value)}
                  >
                    {icon}
                    {!smallActions && <span>{label}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {smallActions ? (
                    <p>{label}</p>
                  ) : (
                    <p>Změní aktuální status chyby.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        };

        return (
          <div className="flex w-full flex-row justify-center">
            {state === "closed" || state === "solved" ? (
              <div className={rowClass}>
                {btn("Otevřít", "open", "blue", <PackageOpen />)}
              </div>
            ) : (
              <div className={rowClass}>
                {btn(
                  "Řešit",
                  "in_progress",
                  "purple",
                  <Hammer />,
                  state === "in_progress",
                )}
                {btn("Vyřešit", "solved", "green", <CheckCheck />)}
                {btn("Uzavřít", "closed", "red", <Ban />)}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        sorting={[{ id: "priority", desc: true }]}
        data={issues}
      />
    </div>
  );
}
