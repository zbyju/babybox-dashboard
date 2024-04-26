"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BatteryMeasurements from "@/components/widgets/battery-measurements";
import { fetcherWithToken } from "@/helpers/api-helper";
import { BabyboxBase } from "@/types/babybox.types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import useSWR from "swr";

export default function BatteryPage({ params }: { params: { slug: string } }) {
  const { token } = useAuth();
  const batteryAnalyzerURL = process.env.NEXT_PUBLIC_URL_BATTERY_ANALYZER;
  const babyboxes = useContext(BabyboxesContext) as BabyboxBase[];
  const babybox = babyboxes.find((x) => x.slug === params.slug);

  const { data, isLoading } = useSWR(
    [`${batteryAnalyzerURL}/v1/measurements/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  console.log(data);
  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Měření baterie</h2>
          {babybox && (
            <h3 className="text-2xl font-semibold text-muted-foreground">
              Babybox {babybox?.name}
            </h3>
          )}
        </div>
        <Link href={"/dashboard/babybox/" + params.slug}>
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
