"use client";

import { fetcherWithToken, snapshotFetcher } from "@/helpers/api-helper";
import ChartPageWrapper from "./chart-page-wrapper";
import { addDays, format } from "date-fns";
import useSWR from "swr";
import { useAuth } from "@/components/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function searchParamTimeToString(
  sp: string | string[] | undefined,
  defaultTime: string,
): string {
  if (sp === undefined) return defaultTime;
  if (typeof sp === "string") return sp;
  return sp[0];
}

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const from: string = searchParamTimeToString(
    searchParams?.from,
    format(addDays(new Date(), -6), "yyyy-MM-dd"),
  );
  const to: string = searchParamTimeToString(
    searchParams?.to,
    format(new Date(), "yyyy-MM-dd"),
  );

  return (
    <div className="">
      <ChartPageWrapper slug={params.slug} from={from} to={to} />
    </div>
  );
}
