"use client";

import {
  fetchAllSnapshots,
  fetchSnapshotsBySlug,
  fetchSnapshotsBySlugAndTime,
  fetcherWithToken,
} from "@/helpers/api-helper";
import ChartPageWrapper from "./chart-page-wrapper";
import { addDays, format } from "date-fns";
import useSWR from "swr";
import { useAuth } from "@/components/contexts/auth-context";

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

  const { token } = useAuth();
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;
  const {
    data: snapshotsData,
    error: snapshotsError,
    isLoading: snapshotsIsLoading,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${from}&to=${to}`,
      token,
    ],
    ([url, token]) => fetcherWithToken(url, token),
  );

  if (snapshotsError) return <>Error</>;
  if (snapshotsIsLoading) return <>Error</>;

  return (
    <div className="h-[92vh] min-h-[400px]">
      <ChartPageWrapper slug={params.slug} snapshots={snapshotsData.data} />
    </div>
  );
}
