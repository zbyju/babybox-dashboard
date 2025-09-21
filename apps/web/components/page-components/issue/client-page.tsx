"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { fetcherWithToken, issuesFetcher } from "@/helpers/api-helper";
import IssuesQuickTable from "@/components/tables/issues-quick-table";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import PageHeading from "@/components/misc/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxIssue } from "@/types/issue.types";
import { toast } from "sonner";
import useSWR from "swr";

interface IssuesPageClientProps {
  slug: string;
}

export default function IssuesPageClient({ slug }: IssuesPageClientProps) {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data,
    isLoading,
    error,
    mutate: mutateIssues,
  } = useSWR(["issues/slug/" + slug, token], ([_, token]) =>
    issuesFetcher(token, slug),
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
      <div className="mt-6 flex w-full flex-col">
        <BreadcrumbsDashboard dashboard slug={slug} />
        <PageHeading heading="Seznam chyb" slug={slug} />
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
              <TabsTrigger value="detailed">Detailní seznam</TabsTrigger>
              <TabsTrigger value="quick">Rychlé akce</TabsTrigger>
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
