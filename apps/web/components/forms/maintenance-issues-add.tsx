import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { useAuth } from "../contexts/auth-context";
import { BabyboxIssue } from "@/types/issue.types";
import useSWR, { KeyedMutator, mutate } from "swr";
import Combobox from "../ui/combobox";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  maintenanceId: string;
  slug: string;
  mutate?: KeyedMutator<BabyboxIssue[]>;
}

export default function MaintenanceIssuesAdd({
  slug,
  maintenanceId,
  mutate,
}: Props) {
  const { token } = useAuth();
  const { data: issues, mutate: mutateIssues } = useSWR(
    ["issues/slug/" + slug, token],
    ([_, token]) => issuesFetcher(token, "/slug/" + slug),
  );

  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  function handleIssuesAdd() {
    const newIssues =
      issues
        ?.filter((i) => i.id && selectedIssues.includes(i.id))
        .map((i) => ({ ...i, maintenance_id: maintenanceId })) || [];

    Promise.all(
      newIssues.map((issue) => {
        fetch(`${babyboxServiceURL}/v1/issues/${issue.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(issue),
        });
      }),
    )
      .then(() => {
        toast.success("Chyby byli přiděleny k servisu.");
        mutateIssues((issues || []).concat(newIssues));
        mutate && mutate((issues || []).concat(newIssues));
        setSelectedIssues([]);
      })
      .catch(() => {
        toast.error("Nastala chyba při přidělování chyb k servisu.");
      });
  }

  return (
    <div className="my-2 flex flex-col">
      <span className="">Přidat chyby</span>
      <Combobox
        values={(issues || [])
          .filter(
            (i) =>
              i.id &&
              i.maintenance_id === undefined &&
              i.slug === slug &&
              !["closed", "solved"].includes(
                (i.state_history || []).at(0)?.state || "",
              ),
          )
          .sort((a, b) => {
            const as = (a.state_history || []).at(0)?.state;
            const bs = (b.state_history || []).at(0)?.state;

            return as === "open" && bs === "open"
              ? a.title.localeCompare(b.title)
              : as === "open"
                ? -1
                : bs === "open"
                  ? 1
                  : a.title.localeCompare(b.title);
          })
          .map((i) => ({ value: i.id || "", label: i.title }))}
        selected={selectedIssues.map((i) => ({
          value: i,
          label: i,
        }))}
        onSelect={(selectedValue) => {
          const val = Array.isArray(selectedValue)
            ? selectedValue
            : [selectedValue];
          setSelectedIssues(val);
        }}
      />
      <Button className="mt-2 w-[70px]" size="sm" onClick={handleIssuesAdd}>
        Přidat
      </Button>
    </div>
  );
}
