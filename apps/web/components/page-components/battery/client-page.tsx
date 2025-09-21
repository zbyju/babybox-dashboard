"use client";

import BatteryMeasurements from "@/components/widgets/battery-measurements";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { useAuth } from "@/components/contexts/auth-context";
import PageHeading from "@/components/misc/page-heading";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

interface BatteryPageClientProps {
  slug: string;
}

export default function BatteryPageClient({ slug }: BatteryPageClientProps) {
  const { token } = useAuth();
  const batteryAnalyzerURL = process.env.NEXT_PUBLIC_URL_BATTERY_ANALYZER;

  const { data, isLoading } = useSWR(
    [`${batteryAnalyzerURL}/v1/measurements/${slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <div>
          <BreadcrumbsDashboard dashboard slug={slug} />
          <PageHeading heading="Měření baterie" slug={slug} />
        </div>
        <Link href={"/dashboard/babybox/" + slug}>
          <Button
            className="flex flex-row items-center justify-between gap-1"
            variant="secondary"
          >
            <ChevronLeft />
            Zpět
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 lg:items-start lg:px-[16%]">
          <Skeleton className="h-4 w-[120px] max-w-full self-start" />
          <Skeleton className="h-[120px] w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[450px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
          <Skeleton className="h-[120px] w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[450px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
        </div>
      ) : (
        <BatteryMeasurements batteryMeasurements={data || []} />
      )}
    </div>
  );
}
