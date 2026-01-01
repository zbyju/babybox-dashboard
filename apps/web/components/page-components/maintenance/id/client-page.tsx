"use client";

import MaintenanceIssuesAdd from "@/components/forms/maintenance-issues-add";
import { translateMaintenanceState } from "@/utils/translations/maintenance";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { colorizeMaintenanceState } from "@/utils/colorize/maintenances";
import IssuesQuickTable from "@/components/tables/issues-quick-table";
import { maintenanceFetcher } from "@/fetchers/maintenance.fetcher";
import { MaintenanceEdit } from "@/components/maintenance-edit";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxIssue } from "@/types/issue.types";
import { Badge } from "@/components/ui/badge";
import { cs } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import useSWR from "swr";

interface MaintenancePageClientProps {
  id: string;
}

export default function MaintenancePageClient({
  id,
}: MaintenancePageClientProps) {
  const { token } = useAuth();
  const {
    data: maintenance,
    isLoading,
    error,
    mutate: mutateMaintenance,
  } = useSWR(["maintenaces/" + id, token], ([_, token]) =>
    maintenanceFetcher(token, id),
  );

  const { data: issues, mutate } = useSWR(
    ["issues/maintenance/" + id, token],
    ([_, token]) => issuesFetcher(token, "/maintenance/" + id),
  );

  const doneIssues = (issues || []).filter((i) =>
    ["closed", "solved"].includes(i.state_history.at(0)?.state || "unknown"),
  );
  const undoneIssues = (issues || []).filter(
    (i) =>
      !["closed", "solved"].includes(i.state_history.at(0)?.state || "unknown"),
  );

  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  async function handleDeleteIssue(id: string) {
    try {
      const res = await fetch(`${babyboxServiceURL}/v1/issues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) throw "Not ok";

      const newIssues = (issues || []).filter((i: BabyboxIssue) => i.id !== id);
      mutate(newIssues);
      toast.success("Chyba úspěšně odebrána.");
    } catch (err) {
      toast.error("Nebylo možné odebrat chybu.");
    }
  }

  function handleChangeIssue(issue: BabyboxIssue) {
    const newIssues = (issues || []).map((i: BabyboxIssue) => {
      if (i.id === issue.id) return issue;
      return i;
    });
    mutate(newIssues);
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
        ) : error || !maintenance ? (
          <div>Nastal error při získávání dat.</div>
        ) : (
          <>
            <BreadcrumbsDashboard
              dashboard
              slug={maintenance.slug}
              links={[
                {
                  href: `/dashboard/babybox/${maintenance.slug}/maintenance`,
                  label: "Seznam servisů",
                },
              ]}
            />
            <div className="flex flex-row gap-2 lg:flex-nowrap">
              <div className="grow">
                <div className="rounded-xl border border-border">
                  <div className="flex flex-col gap-4 p-6">
                    <h4 className="text-4xl font-bold">{maintenance.title}</h4>
                    <h5 className="flex flex-row flex-wrap items-center gap-2 text-lg font-medium text-muted-foreground">
                      <Badge
                        className="px-3 py-1 text-base"
                        style={{
                          backgroundColor: colorizeMaintenanceState(
                            maintenance.state,
                          ),
                        }}
                      >
                        {translateMaintenanceState(maintenance.state)}
                      </Badge>
                      <span>
                        Servis začal{" "}
                        {format(maintenance.start, "dd. MMMM yyyy HH:mm", {
                          locale: cs,
                        })}
                        {maintenance.end && (
                          <span>
                            {" "}
                            a skončil{" "}
                            {format(maintenance.end, "dd. MMMM yyyy HH:mm", {
                              locale: cs,
                            })}
                          </span>
                        )}
                      </span>
                    </h5>
                    <Separator />
                    <div>
                      <h5 className="text-2xl font-medium">Popis chyby</h5>
                      <p className="text-base font-normal">
                        {maintenance.note || "Popis nebyl vyplněn."}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex flex-row flex-wrap items-center gap-6">
                      <div>
                        {maintenance.assignee ? (
                          <div className="text-muted-foreground">
                            Vyřešení přiděleno:{" "}
                            <span className="text-foreground">
                              {maintenance.assignee}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Servis nebyl nikomu přidělen.
                          </span>
                        )}
                      </div>
                      <div>
                        {maintenance.distance ? (
                          <div className="text-muted-foreground">
                            Ujetých kilometrů:{" "}
                            <span className="text-foreground">
                              {maintenance.distance}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Počet kilometrů nevyplněn.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {maintenance.id && (
                  <MaintenanceIssuesAdd
                    slug={maintenance.slug}
                    maintenanceId={maintenance.id}
                    mutate={mutate}
                  />
                )}
              </div>
              {maintenance.state !== "completed" && (
                <div>
                  <MaintenanceEdit
                    maintenance={maintenance}
                    onChange={(maintenance) => {
                      mutateMaintenance(maintenance);
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {maintenance?.state === "completed" ? (
          <div>
            <h5 className="mb-4 text-2xl font-medium">Chyby</h5>
            <IssuesTable
              issues={issues || []}
              onDelete={handleDeleteIssue}
              onUpdate={handleChangeIssue}
            />
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-between gap-2">
            <div className="w-full lg:w-[49%]">
              <h5 className="mb-4 text-2xl font-medium">Otevřené chyby</h5>
              <IssuesQuickTable issues={undoneIssues} mutate={mutate} />
            </div>
            <div className="w-full lg:w-[49%]">
              <h5 className="mb-4 text-2xl font-medium">Hotové chyby</h5>
              <IssuesQuickTable issues={doneIssues} mutate={mutate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
