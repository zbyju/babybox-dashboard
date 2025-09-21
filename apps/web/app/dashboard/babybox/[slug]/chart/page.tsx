"use client";

import ChartPageWrapper from "./chart-page-wrapper";
import { addDays, format } from "date-fns";
import { NextPage } from "next";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Home: NextPage<PageProps> = ({ params, searchParams }) => {
  const from: string = searchParamTimeToString(
    searchParams?.from,
    format(addDays(new Date(), -6), "yyyy-MM-dd"),
  );
  const to: string = searchParamTimeToString(
    searchParams?.to,
    format(new Date(), "yyyy-MM-dd"),
  );

  return (
    <div>
      <ChartPageWrapper slug={params.slug} from={from} to={to} />
    </div>
  );
};

function searchParamTimeToString(
  sp: string | string[] | undefined,
  defaultTime: string,
): string {
  if (sp === undefined) return defaultTime;
  if (typeof sp === "string") return sp;
  return sp[0];
}

export default Home;
