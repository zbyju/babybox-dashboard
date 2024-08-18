import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { useAuth } from "../contexts/auth-context";
import { Props } from "react-apexcharts";
import Combobox from "../ui/combobox";
import { useState } from "react";
import useSWR from "swr";

export default function MaintenanceIssuesAdd({ slug }: Props) {
  const { token } = useAuth();
  const { data: issues } = useSWR(
    ["issues/slug/" + slug, token],
    ([_, token]) => issuesFetcher(token, "/slug/" + slug),
  );

  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  return (
    <FormField
      name="maintenance"
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel className="">Chyby</FormLabel>
          <FormControl>
            <Combobox
              values={(issues || [])
                .filter(
                  (i) =>
                    i.id &&
                    i.maintenance_id === undefined &&
                    i.slug === slug &&
                    !["closed", "solved"].includes(
                      i.state_history.at(0)?.state || "",
                    ),
                )
                .sort((a, b) => {
                  const as = a.state_history.at(0)?.state;
                  const bs = b.state_history.at(0)?.state;

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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
