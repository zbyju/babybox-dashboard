import {
  fetchAllSnapshots,
  fetchSnapshotsBySlug,
  fetchSnapshotsBySlugAndTime,
} from "@/helpers/api-helper";
import ChartPageWrapper from "./chart-page-wrapper";
import { addDays, format } from "date-fns";

function searchParamTimeToString(
  sp: string | string[] | undefined,
  defaultTime: string,
): string {
  if (sp === undefined) return defaultTime;
  if (typeof sp === "string") return sp;
  return sp[0];
}

export default async function Home({
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
  const snapshots = await fetchSnapshotsBySlugAndTime(params.slug, from, to);
  return (
    <div className="h-[92vh] min-h-[400px]">
      <ChartPageWrapper slug={params.slug} snapshots={snapshots} />
    </div>
  );
}
