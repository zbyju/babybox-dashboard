"use client";

import ChartControl from "@/components/charts/main-chart/chart-control";
import LineChart from "@/components/charts/line-chart";
import ChartStats from "@/components/charts/main-chart/chart-stats";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot } from "@/types/snapshot.types";
import { addDays } from "date-fns";
import { ChartSourcesObject } from "@/components/charts/main-chart/chart-sources";
import { ChartSettingsObject } from "@/components/charts/main-chart/chart-settings";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DateRange,
  dateToStringDate,
} from "@/components/charts/main-chart/time-filter";
import { Event, Interval } from "@/types/event.types";
import {
  combineIntervals,
  decodeEvent,
  generateIntervals,
} from "@/utils/events";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/components/contexts/auth-context";
import { fetcherWithToken, snapshotFetcher } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function transformData(
  originalData: Snapshot[],
  fieldsToExtract: {
    group: string;
    variable: string;
    name: string;
    color: string;
  }[],
): ApexAxisChartSeries {
  const series: ApexAxisChartSeries = [];
  fieldsToExtract.forEach(({ group, variable, name, color }) => {
    series.push({
      name,
      color,
      data: originalData.map((item) => {
        return {
          x: item.timestamp.getTime(),
          // @ts-expect-error apex
          y: item[group][variable],
        };
      }),
    });
  });

  return series;
}

function convertObjectToString(obj: object) {
  // @ts-expect-error wtf
  const keys = Object.keys(obj).filter((key) => obj[key] === true);
  return keys.join(",");
}

export default function ChartPageWrapper({
  slug,
  from,
  to,
}: {
  slug: string;
  from: string;
  to: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { token } = useAuth();
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;

  const [sources, setSources] = useState<ChartSourcesObject>({
    temperature: searchParams?.get("sources")?.includes("temperature") ?? false,
    voltage: searchParams?.get("sources")?.includes("voltage") ?? false,
    heating: searchParams?.get("sources")?.includes("heating") ?? false,
    fans: searchParams?.get("sources")?.includes("fans") ?? false,
    doors: searchParams?.get("sources")?.includes("doors") ?? false,
    temperatureSetting:
      searchParams?.get("sources")?.includes("temperatureSetting") ?? false,
    sun: searchParams?.get("sources")?.includes("sun") ?? false,
  });
  const sourcesFiltered = [
    {
      group: "temperature",
      variable: "inside",
      name: "Vnitřní teplota",
      color: "hsl(var(--inside))",
    },
    {
      group: "temperature",
      variable: "outside",
      name: "Venkovní teplota",
      color: "hsl(var(--outside))",
    },
    {
      group: "temperature",
      variable: "casing",
      name: "Teplota pláště",
      color: "hsl(var(--casing))",
    },
    {
      group: "temperature",
      variable: "top",
      name: "Horní teplota",
      color: "hsl(var(--heating))",
    },
    {
      group: "temperature",
      variable: "bottom",
      name: "Spodní teplota",
      color: "hsl(var(--cooling))",
    },
    {
      group: "voltage",
      variable: "in",
      name: "Vstupní napětí",
      color: "hsl(var(--in))",
    },
    {
      group: "voltage",
      variable: "battery",
      name: "Napětí baterie",
      color: "hsl(var(--battery))",
    },
  ].filter((x) => {
    if (x.group === "temperature") {
      return sources.temperature;
    }
    if (x.group === "voltage") {
      return sources.voltage;
    }
    return true;
  });

  const {
    data: snapshots,
    error: snapshotsError,
    isLoading: snapshotsIsLoading,
  } = useSWR(
    sources.temperature || sources.voltage
      ? [
          `${snapshotServiceURL}/v1/snapshots/${slug}?from=${from}&to=${to}&fill=lazy`,
          token,
        ]
      : null,
    ([url, token]) => snapshotFetcher(url, token),
  );

  const {
    data: snapshotsTable,
    error: snapshotsTableError,
    isLoading: snapshotsTableIsLoading,
  } = useSWR(
    sources.temperature || sources.voltage
      ? [
          `${snapshotServiceURL}/v1/snapshots/${slug}?from=${from}&to=${to}&fill=fill`,
          token,
        ]
      : null,
    ([url, token]) => snapshotFetcher(url, token),
  );

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsIsLoading,
  } = useSWR(
    sources.heating || sources.fans
      ? [`${snapshotServiceURL}/v1/events/${slug}?from=${from}&to=${to}`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

  const series = transformData(snapshots || [], sourcesFiltered);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: dateToStringDate(addDays(new Date(), -7)),
    to: dateToStringDate(new Date()),
  });
  const [chartSettings, setChartSettings] = useState<ChartSettingsObject>({
    strokeWidth: 1,
    strokeType: "straight",
  });

  const eventColors: {
    [key: string]: { borderColor: string; fillColor: string };
  } = {
    Heating: {
      borderColor: "hsl(var(--heating))",
      fillColor: "hsl(var(--heating))",
    },
    HeatingCasing: {
      borderColor: "hsl(var(--casing))",
      fillColor: "hsl(var(--casing))",
    },
    Cooling: {
      borderColor: "hsl(var(--cooling))",
      fillColor: "hsl(var(--cooling))",
    },
    FanTop: {
      borderColor: "hsl(var(--in))",
      fillColor: "hsl(var(--in))",
    },
    FanBottom: {
      borderColor: "hsl(var(--battery))",
      fillColor: "hsl(va(--battery))",
    },
    Doors: {
      borderColor: "hsl(var(--outside))",
      fillColor: "hsl(var(--outside))",
    },
  };

  function convertIntervalsToAnnotations(
    intervals: Interval[],
  ): XAxisAnnotations[] {
    return intervals.map((interval) => ({
      x: interval.from.getTime(),
      x2: interval.to.getTime(),
      label: {
        text: interval.type,
        borderColor: eventColors[interval.type].borderColor,
        style: {
          fontSize: "8px",
        },
      },
      borderColor: eventColors[interval.type].borderColor,
      fillColor: eventColors[interval.type].fillColor,
    }));
  }

  const eventsDecoded =
    eventsError || eventsIsLoading || !eventsData || !("data" in eventsData)
      ? []
      : eventsData?.data.map((e: unknown) => decodeEvent(e as Event));
  const intervals = combineIntervals(generateIntervals(eventsDecoded));
  const filteredIntervals = intervals.filter((i) => {
    if (
      i.type.toLowerCase().includes("heating") ||
      i.type.toLowerCase().includes("cooling")
    ) {
      return sources.heating;
    }
    if (i.type.toLowerCase().includes("fans")) {
      return sources.fans;
    }
    return false;
  });

  const annotations = {
    xaxis: [...convertIntervalsToAnnotations(filteredIntervals)],
  };

  function onSourcesChange(sources: ChartSourcesObject) {
    const existing = Object.fromEntries(searchParams?.entries() ?? []);
    router.push(
      `?${new URLSearchParams({
        ...existing,
        sources: convertObjectToString(sources),
      })}`,
    );
    setSources(sources);
  }

  function onDateChange(dateRange: DateRange) {
    const existing = Object.fromEntries(searchParams?.entries() ?? []);
    router.push(
      `?${new URLSearchParams({
        ...existing,
        from: dateRange.from,
        to: dateRange.to,
      })}`,
    );
    setDateRange(dateRange);
  }

  useEffect(() => {
    if (searchParams === null) return;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const sources = searchParams.get("sources");

    const newSources = {
      temperature: sources?.includes("temperature") ?? false,
      voltage: sources?.includes("voltage") ?? false,
      heating: sources?.includes("heating") ?? false,
      fans: sources?.includes("fans") ?? false,
      doors: sources?.includes("doors") ?? false,
      temperatureSetting: sources?.includes("temperatureSetting") ?? false,
      sun: sources?.includes("sun") ?? false,
    };

    const newDateRange = {
      ...dateRange,
    };
    if (from !== null) {
      newDateRange.from = from;
    }
    if (to !== null) {
      newDateRange.to = to;
    }

    setDateRange(newDateRange);
    setSources(newSources);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="h-[92vh] min-h-[400px]">
        <div className="mb-5 flex h-full w-full flex-col gap-6">
          {snapshotsIsLoading || eventsIsLoading ? (
            <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-3">
              <Skeleton className="h-full w-11/12" />
            </div>
          ) : snapshotsError || eventsError ? (
            <Alert
              variant="destructive"
              className="mx-auto w-11/12 lg:w-[500px]"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Chyba při načítání dat.</AlertDescription>
            </Alert>
          ) : (
            <LineChart
              id="main-chart"
              series={series}
              annotations={annotations}
              xaxisType="datetime"
              showGrid
              showToolbar
              showLegend
              zoom
              strokeType={chartSettings.strokeType}
              strokeWidth={chartSettings.strokeWidth}
            />
          )}
          <div className="px-4 pb-2">
            <ChartControl
              sources={sources}
              onSourcesChange={onSourcesChange}
              chartSettings={chartSettings}
              onSettingsChange={setChartSettings}
              dateRange={dateRange}
              onDateRangeChange={onDateChange}
              slug={slug}
            />
          </div>
        </div>
      </div>
      <div className="mb-5 border-t border-t-border px-4 pt-5">
        <h2 className="ml-1 text-3xl font-bold leading-6">Statistiky</h2>
        <h3 className="mb-6 ml-1 text-muted-foreground">Z vybraného období</h3>
        {snapshotsIsLoading ? (
          <div className="mt-4 flex w-full flex-row items-center justify-center gap-6 lg:items-start lg:px-[16%]">
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
            <Skeleton className="h-[200px] w-[250px] max-w-full" />
          </div>
        ) : snapshotsError || eventsError ? (
          <></>
        ) : (
          <ChartStats data={snapshots || []} />
        )}
      </div>
      <div className="mt-12 px-4 pb-2">
        <h2 className="mb-4 ml-1 text-3xl font-bold leading-6">Tabulka dat</h2>
        {snapshotsTableIsLoading ? (
          <div className="mt-4 flex w-full flex-col items-center justify-center gap-6 lg:items-start lg:px-[16%]">
            <Skeleton className="h-8 w-11/12 max-w-full" />
            <Skeleton className="h-4 w-11/12 max-w-full" />
            <Skeleton className="h-4 w-11/12 max-w-full" />
            <Skeleton className="h-4 w-11/12 max-w-full" />
            <Skeleton className="h-4 w-11/12 max-w-full" />
            <Skeleton className="h-4 w-11/12 max-w-full" />
          </div>
        ) : snapshotsTableError ? (
          <></>
        ) : (
          <LatestSnapshots
            snapshots={snapshotsTable || []}
            take={99999}
            showPagination={true}
          />
        )}
      </div>
    </>
  );
}
