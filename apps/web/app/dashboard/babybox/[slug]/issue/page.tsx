"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcherWithToken, issuesFetcher } from "@/helpers/api-helper";
import IssuesQuickTable from "@/components/tables/issues-quick-table";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxIssue } from "@/types/issue.types";
import { toast } from "sonner";
import useSWR from "swr";

export default function Issues({ params }: { params: { slug: string } }) {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data,
    isLoading,
    error,
    mutate: mutateIssues,
  } = useSWR(["issues/slug/" + params.slug, token], ([_, token]) =>
    issuesFetcher(token, params.slug),
  );

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  useSWR([`${userServiceURL}/v1/users/`, token], ([url, token]) =>
    fetcherWithToken(url, token),
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

      const issues = (data || []).filter((u: BabyboxIssue) => u.id !== id);
      mutateIssues(issues);
      toast.success("Chyba úspěšně odebrána.");
    } catch (err) {
      toast.error("Nebylo možné odebrat chybu.");
    }
  }

  function handleChangeIssue(issue: BabyboxIssue) {
    const issues = (data || []).map((i: BabyboxIssue) => {
      if (i.id === issue.id) return issue;
      return i;
    });
    mutateIssues(issues);
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-8 flex w-full flex-col gap-2">
        <h2 className="text-3xl font-bold">Reportované chyby</h2>
        {isLoading ? (
          <div className="mx-auto flex flex-col justify-center gap-4">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
          </div>
        ) : error || !data ? (
          <div>Error</div>
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
                issues={data || []}
                onUpdate={handleChangeIssue}
                onDelete={handleDeleteIssue}
              />
            </TabsContent>
            <TabsContent value="quick">
              <IssuesQuickTable
                issues={data || []}
                mutate={mutateIssues}
                smallActions
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
