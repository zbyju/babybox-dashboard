"use client";

import { translateMaintenanceState } from "@/utils/translations/maintenance";
import { maintenanceFetcher } from "@/fetchers/maintenance.fetcher";
import { useAuth } from "@/components/contexts/auth-context";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { colorizeStatus } from "@/utils/colorize/issues";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cs } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import useSWR from "swr";

export default function Issue({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const {
    data: maintenance,
    isLoading,
    error,
  } = useSWR(["maintenaces/" + params.id, token], ([_, token]) =>
    maintenanceFetcher(token, params.id),
  );

  const { data: issues } = useSWR(
    ["issues/maintenance/" + params.id, token],
    ([_, token]) => issuesFetcher(token, "/maintenance/" + params.id),
  );

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
          <div>
            <div className="rounded-xl border border-border">
              <div className="flex flex-col gap-4 p-6">
                <h4 className="text-4xl font-bold">{maintenance.title}</h4>
                <h5 className="flex flex-row flex-wrap items-center items-center gap-2 text-lg font-medium text-muted-foreground">
                  <Badge
                    className="px-3 py-1 text-base"
                    style={{
                      backgroundColor: colorizeStatus(maintenance.state),
                    }}
                  >
                    {translateMaintenanceState(maintenance.state)}
                  </Badge>
                  <span>
                    Servis začal v
                    {format(maintenance.start, "dd. MMMM yyyy HH:mm", {
                      locale: cs,
                    })}
                    {maintenance.end && (
                      <span>
                        {" "}
                        a skončil v
                        {format(maintenance.end, "dd. MMMM yyyy HH:mm", {
                          locale: cs,
                        })}
                      </span>
                    )}
                  </span>
                </h5>
                <div className="mt-8 flex flex-row flex-wrap gap-4">
                  <div className="min-w-[300px] rounded-xl border border-border p-3">
                    <h5 className="mb-2 text-lg font-medium">Popis chyby</h5>
                    <p className="text-base font-normal">
                      {maintenance.note || "Popis nebyl vyplněn."}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-row flex-wrap items-center gap-6">
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
                </div>
              </div>
            </div>
          </div>
        )}
        <h4 className="text-2xl font-medium">Chyby:</h4>
        {(issues || []).map((i) => (
          <Link href={`/dashboard/issue/${i.id}`} key={i.id}>
            <div className="rounded-xl border border-border px-4 py-3">
              {i.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
