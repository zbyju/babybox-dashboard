"use client";

import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import PageHeading from "@/components/misc/page-heading";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxBase } from "@/types/babybox.types";
import { BabyboxIssue } from "@/types/issue.types";
import IssueAdd from "@/components/issue-add";
import { useContext } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Issues({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const babybox = getBabyboxBySlug(slug);

  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data: issues,
    isLoading: issuesLoading,
    mutate: mutateIssues,
  } = useSWR(["issues/slug/" + slug, token], ([_, token]) =>
    issuesFetcher(token, "/slug/" + slug),
  );

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { data: userData } = useSWR(
    [`${userServiceURL}/v1/users/`, token],
    ([url, token]) => fetcherWithToken(url, token),
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

  function handleAddIssue(issue: BabyboxIssue) {
    const newIssues = (issues || []).concat(issue);
    mutateIssues(newIssues);
  }

  function handleChangeIssue(issue: BabyboxIssue) {
    const newIssues = (issues || []).map((i: BabyboxIssue) => {
      if (i.id === issue.id) return issue;
      return i;
    });
    mutateIssues(newIssues);
  }

  return (
    <div className="mb-10 mt-6 w-full px-4 lg:px-[16%]">
      <div>
        <BreadcrumbsDashboard dashboard slug={slug} />
        <PageHeading heading="Reportovat Chybu" slug={slug} />
        <IssueAdd
          issue={{ slug: slug }}
          onAdd={handleAddIssue}
          users={userData?.data}
        />
      </div>
      <div className="mt-8 flex w-full flex-col gap-2">
        <PageHeading heading="Reportované chyby" slug={slug} />
        {issuesLoading ? (
          <div className="mx-auto flex flex-col justify-center gap-4">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
          </div>
        ) : (
          <IssuesTable
            issues={issues || []}
            onUpdate={handleChangeIssue}
            onDelete={handleDeleteIssue}
          />
        )}
      </div>
    </div>
  );
}
