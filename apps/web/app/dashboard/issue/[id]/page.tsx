"use client";

import {
  colorizeIssueType,
  colorizePriority,
  colorizeSeverity,
  colorizeStatus,
} from "@/utils/colorize/issues";
import {
  fetcherWithToken,
  issueFetcher,
  issuesFetcher,
  updateIssue,
} from "@/helpers/api-helper";
import { translateIssueState } from "@/utils/translations/issue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/contexts/auth-context";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { combineHistories } from "@/utils/issue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Issue({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState("");
  const { token, user } = useAuth();
  const {
    data: rawIssue,
    isLoading,
    error,
    mutate,
  } = useSWR(["issues/" + params.id, token], ([_, token]) =>
    issueFetcher(token, params.id),
  );

  const issue = rawIssue
    ? {
        ...rawIssue,
        created_at:
          rawIssue.state_history.length > 0
            ? rawIssue.state_history[rawIssue.state_history.length - 1]
            : undefined,
        opened_at:
          rawIssue.state_history.length >= 2
            ? rawIssue.state_history[rawIssue.state_history.length - 2]
            : rawIssue.state_history.length >= 1
              ? rawIssue.state_history[rawIssue.state_history.length - 1]
              : undefined,
        status:
          rawIssue.state_history.length > 0
            ? rawIssue.state_history[0]
            : undefined,
        history: combineHistories(rawIssue),
      }
    : undefined;

  async function handleSubmitComment() {
    if (rawIssue === undefined) return;
    const newIssue = {
      ...rawIssue,
      comments:
        rawIssue?.comments.toSpliced(0, 0, {
          text: comment,
          timestamp: new Date(),
          username: user?.username || "",
        }) || [],
    };
    try {
      await updateIssue(newIssue, token);
      toast.success("Komentář úspěšně přidán.");
      setComment("");
      mutate(newIssue);
    } catch (err) {
      toast.error("Vyskytla se chyba při přidávání komentáře.");
      console.log(err);
    }
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-col gap-4">
        {isLoading ? (
          <div className="mx-auto flex w-full flex-col justify-center gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error || !issue ? (
          <div>Nastal error při získávání dat.</div>
        ) : (
          <div>
            <div className="rounded-xl border border-border">
              <div className="flex flex-col gap-4 p-6">
                <h4 className="text-4xl font-bold">{issue.title}</h4>
                <h5 className="flex flex-row flex-wrap items-center items-center gap-2 text-lg font-medium text-muted-foreground">
                  <Badge
                    className="px-3 py-1 text-base"
                    style={{
                      backgroundColor: colorizeIssueType(issue.issue.type),
                    }}
                  >
                    {issue.issue.type} - {issue.issue.subtype}
                  </Badge>
                  <Badge
                    className="px-3 py-1 text-base"
                    style={{
                      backgroundColor: colorizeStatus(
                        issue.status?.state || "",
                      ),
                    }}
                  >
                    {translateIssueState(issue.status?.state || "")}
                  </Badge>
                  <span>
                    Chyba byla založena{" "}
                    {format(
                      issue.opened_at?.timestamp || new Date(),
                      "dd. MMMM yyyy HH:mm",
                      {
                        locale: cs,
                      },
                    )}{" "}
                    uživatelem {issue.opened_at?.username}.
                  </span>
                </h5>
                <div className="mt-8 flex flex-row flex-wrap gap-4">
                  <div className="min-w-[300px] rounded-xl border border-border p-3">
                    <h5 className="mb-2 text-lg font-medium">Popis chyby</h5>
                    <p className="text-base font-normal">
                      {issue.issue.description || "Popis nebyl vyplněn."}
                    </p>
                  </div>
                  <div className="min-w-[300px] rounded-xl border border-border p-3">
                    <h5 className="mb-2 text-lg font-medium">Kontext chyby</h5>
                    <p className="text-base font-normal">
                      {issue.issue.context || "Kontext nebyl vyplněn."}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-row flex-wrap items-center gap-6">
                  <div>
                    <span className="mr-1 text-muted-foreground">
                      Priorita:{" "}
                    </span>
                    <Badge
                      style={{
                        backgroundColor: colorizePriority(issue.priority || ""),
                      }}
                    >
                      {issue.priority || "Neuvedeno"}
                    </Badge>
                  </div>
                  <div>
                    <span className="mr-1 text-muted-foreground">
                      Severita:{" "}
                    </span>
                    <Badge
                      style={{
                        backgroundColor: colorizeSeverity(issue.severity || ""),
                      }}
                    >
                      {issue.severity || "Neuvedeno"}
                    </Badge>
                  </div>
                  <div>
                    {issue.assignee ? (
                      <div className="text-muted-foreground">
                        Vyřešení přiděleno:{" "}
                        <span className="text-foreground">
                          {issue.assignee}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Chyba nebyla nikomu přidělena.
                      </span>
                    )}
                  </div>
                  <div>
                    {issue.maintenance_id ? (
                      <div className="text-muted-foreground">
                        Servis:{" "}
                        <span className="text-foreground">
                          <a
                            href={`/dashboard/maintenance/${issue.maintenance_id}`}
                            className="underlin"
                          >
                            {issue.maintenance_id}
                          </a>
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Chyba nebyla přidána do žádného servisu.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {issue.history.map((h) => (
                <div key={h.timestamp.getTime()}>
                  {h.type === "state" ? (
                    <div className="flex flex-row">
                      <div className="flex flex-col justify-center">
                        <div className="ml-[18px] w-[4px] flex-grow bg-slate-300 dark:bg-slate-600"></div>
                        <Avatar>
                          <AvatarFallback className="bg-slate-300 dark:bg-slate-700">
                            {h.username.slice(0, 2) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-[18px] w-[4px] flex-grow bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      <div className="ml-4 py-4">
                        <h6 className="text-muted-foreground">
                          {h.username || "?"} -{" "}
                          {format(h.timestamp, "dd. MMMM yyyy HH:mm", {
                            locale: cs,
                          })}
                        </h6>
                        <h5>
                          Stav byl změněn na:
                          <Badge
                            className="ml-2 px-3 py-2"
                            style={{ backgroundColor: colorizeStatus(h.value) }}
                          >
                            {translateIssueState(h.value)}
                          </Badge>
                        </h5>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full rounded-xl border border-border">
                      <div className="p-4">
                        <div className="flex flex-row flex-wrap items-center gap-2">
                          <Avatar className="mr-2">
                            <AvatarFallback className="bg-slate-300 bg-slate-700">
                              {h.username.slice(0, 2) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {h.username}
                          <div className="text-muted-foreground">
                            {format(h.timestamp, "dd. MMMM yyyy HH:mm", {
                              locale: cs,
                            })}
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="ml-1 mt-4">{h.value}</div>
                      </div>
                    </div>
                  )}

                  <div className="ml-[18px] h-[30px] w-[4px] bg-border"></div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border">
              <div className="p-4">
                <h4 className="mb-4 text-xl font-medium">Přidat Komentář</h4>
                <Textarea
                  className="bg-slate-100 dark:bg-slate-930"
                  placeholder="Text komentáře..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={handleSubmitComment} className="mt-4">
                  Odeslat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
