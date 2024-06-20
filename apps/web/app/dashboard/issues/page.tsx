"use client";

import { useAuth } from "@/components/contexts/auth-context";
import IssueAdd from "@/components/issue-add";
import IssuesTable from "@/components/tables/issues-table";
import UsersTable from "@/components/tables/users-table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcherWithToken } from "@/helpers/api-helper";
import { BabyboxIssue } from "@/types/babybox.types";
import { User } from "@/types/user.types";
import { toast } from "sonner";
import useSWR from "swr";

export default function Issues() {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data: issuesData,
    isLoading: issuesIsLoading,
    mutate: mutateIssues,
  } = useSWR([`${babyboxServiceURL}/v1/issues/`, token], ([url, token]) =>
    fetcherWithToken(url, token),
  );

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { data: userData, isLoading: userIsLoading } = useSWR(
    [`${userServiceURL}/v1/users/`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  async function handleDeleteIssue(id: string) {
    try {
      await fetch(`${babyboxServiceURL}/v1/isses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const users = (issuesData?.data || []).filter(
        (u: BabyboxIssue) => u.id !== id,
      );
      mutateIssues({ ...issuesData, data: users });
      toast.success("Uživatel úspěšně odebrán.");
    } catch (err) {
      toast.error("Nebylo možné odebrat uživatele.");
    }
  }

  function handleAddIssue(issue: BabyboxIssue) {
    const issues = (issuesData?.data || []).concat(issue);
    mutateIssues({ ...issuesData, data: issues });
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div>
        <IssueAdd onAdd={handleAddIssue} users={userData?.data} />
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <h2 className="text-3xl font-bold">Reportované chyby</h2>
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
            issues={issuesData?.data || []}
            onDelete={handleDeleteIssue}
          />
        )}
      </div>
    </div>
  );
}
