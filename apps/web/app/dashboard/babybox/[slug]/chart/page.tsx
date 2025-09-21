import ChartPageWrapper from "./chart-page-wrapper";
import { addDays, format } from "date-fns";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function searchParamTimeToString(
  sp: string | string[] | undefined,
  defaultTime: string,
): string {
  if (sp === undefined) return defaultTime;
  if (typeof sp === "string") return sp;
  return sp[0];
}

export default async function ChartPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const from: string = searchParamTimeToString(
    resolvedSearchParams?.from,
    format(addDays(new Date(), -6), "yyyy-MM-dd"),
  );
  const to: string = searchParamTimeToString(
    resolvedSearchParams?.to,
    format(new Date(), "yyyy-MM-dd"),
  );

  return <ChartPageWrapper slug={slug} from={from} to={to} />;
}
