"use client";

import {
  maintenancesFetcher,
  maintenancesFetcherSuffix,
} from "@/fetchers/maintenance.fetcher";
import BabyboxesMaintenanceTable from "@/components/tables/babyboxes-maintenance-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssuesQuickTable from "@/components/tables/issues-quick-table";
import MaintenanceTable from "@/components/tables/maintenance-table";
import { BabyboxMaintenance } from "@/types/maintenance.types";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import MaintenanceAdd from "@/components/maintenance-add";
import PageHeading from "@/components/misc/page-heading";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxIssue } from "@/types/issue.types";
import { toast } from "sonner";
import useSWR from "swr";

export default function Profile() {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token, user } = useAuth();
  const username = user?.username || "null";
  const {
    data: maintenances,
    isLoading: isLoadingMaintenances,
    mutate: mutateMaintenances,
  } = useSWR(["maintenaces/username/" + username, token], ([_, token]) =>
    maintenancesFetcherSuffix(token, "username/" + username),
  );

  const {
    data: issues,
    isLoading: isLoadingIssues,
    mutate: mutateIssues,
  } = useSWR(
    ["issues/username/" + user?.username || null, token],
    ([_, token]) => issuesFetcher(token, "/username/" + username),
  );

  async function handleDeleteIssue(id: string) {
    try {
      const res = await fetch(`${babyboxServiceURL}/v1/issues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) throw "Not ok";

      const newIssues = (issues || []).filter((u: BabyboxIssue) => u.id !== id);
      mutateIssues(newIssues);
      toast.success("Chyba úspěšně odebrána.");
    } catch (err) {
      toast.error("Nebylo možné odebrat chybu.");
    }
  }

  async function handleDeleteMaintenance(id: string) {
    try {
      await fetch(`${babyboxServiceURL}/v1/maintenances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const newMaintenances = (maintenances || []).filter(
        (u: BabyboxMaintenance) => u.id !== id,
      );
      mutateMaintenances(newMaintenances);
      toast.success("Servis úspěšně odebrán.");
    } catch (err) {
      toast.error("Nebylo možné odebrat servis.");
    }
  }

  function handleChangeIssue(issue: BabyboxIssue) {
    const newIssues = (issues || []).map((i: BabyboxIssue) => {
      if (i.id === issue.id) return issue;
      return i;
    });
    mutateIssues(newIssues);
  }

  return (
    <div className="mb-10 mt-4 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-col">
        <PageHeading heading="Vaše chyby" />
        {isLoadingMaintenances || isLoadingIssues ? (
          <div className="mx-auto flex flex-col justify-center gap-4">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
          </div>
        ) : (
          <Tabs defaultValue="detailed">
            <TabsList>
              <TabsTrigger value="detailed">Detailní seznam chyb</TabsTrigger>
              <TabsTrigger value="quick">
                Seznam chyb pro rychlou úpravu
              </TabsTrigger>
            </TabsList>
            <TabsContent value="detailed">
              <IssuesTable
                issues={issues || []}
                onUpdate={handleChangeIssue}
                onDelete={handleDeleteIssue}
              />
            </TabsContent>
            <TabsContent value="quick">
              <IssuesQuickTable
                issues={issues || []}
                mutate={mutateIssues}
                smallActions
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <div className="mt-8 flex w-full flex-col">
        <PageHeading heading="Vaše servisy" />
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="all">Všechny</TabsTrigger>
            <TabsTrigger value="open">Otevřené</TabsTrigger>
            <TabsTrigger value="completed">Uzavřené</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <MaintenanceTable
              maintenances={(maintenances || []).filter(
                (m) => m.state === "open",
              )}
              onDelete={handleDeleteMaintenance}
            />
          </TabsContent>
          <TabsContent value="completed">
            <MaintenanceTable
              maintenances={(maintenances || []).filter(
                (m) => m.state === "completed",
              )}
              onDelete={handleDeleteMaintenance}
            />
          </TabsContent>
          <TabsContent value="all">
            <MaintenanceTable
              maintenances={maintenances || []}
              onDelete={handleDeleteMaintenance}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
