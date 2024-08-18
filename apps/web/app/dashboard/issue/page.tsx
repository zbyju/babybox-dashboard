"use client";

import { fetcherWithToken, issuesFetcher } from "@/helpers/api-helper";
import { useAuth } from "@/components/contexts/auth-context";
import IssuesTable from "@/components/tables/issues-table";
import PageHeading from "@/components/misc/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxIssue } from "@/types/issue.types";
import IssueAdd from "@/components/issue-add";
import { toast } from "sonner";
import useSWR from "swr";

export default function Issues() {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data: issues,
    isLoading: issuesIsLoading,
    mutate: mutateIssues,
  } = useSWR(token, (token) => issuesFetcher(token));

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
    const newIssues = (issues || []).concat([issue]);
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
    <div className="mb-10 mt-4 w-full px-4 lg:px-[16%]">
      <div>
        <PageHeading heading="Přidat chybu" wrapperClassName="mb-1" />
        <IssueAdd onAdd={handleAddIssue} users={userData?.data} />
      </div>
      <div className="mt-8 flex w-full flex-col">
        <PageHeading heading="Reportované chyby" />
        {issuesIsLoading ? (
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
