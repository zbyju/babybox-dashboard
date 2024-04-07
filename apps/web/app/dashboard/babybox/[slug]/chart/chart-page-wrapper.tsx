"use client";

import { events } from "../../../../../data/heating_cooling_events";
import ChartControl from "@/components/charts/main-chart/chart-control";
import LineChart from "@/components/charts/line-chart";
import ChartStats from "@/components/charts/main-chart/chart-stats";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot } from "@/types/snapshot.types";
import { addDays, parse } from "date-fns";
import { ChartSourcesObject } from "@/components/charts/main-chart/chart-sources";
import { ChartSettingsObject } from "@/components/charts/main-chart/chart-settings";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DateRange,
  dateToStringDate,
} from "@/components/charts/main-chart/time-filter";
import { Interval } from "@/types/event.types";
import { combineIntervals, generateIntervals } from "@/utils/events";
import { fetchAllSnapshots } from "@/helpers/api-helper";
import { useEffect, useState } from "react";

function calculateStrokeWidth(series: ApexAxisChartSeries): number {
  const n = series.length > 0 ? series[0].data.length : 0;
  if (n > 1000) {
    return 1;
  } else if (n > 144) {
    return 2;
  } else if (n > 70) {
    return 3;
  }
  return 4;
}

function calculateStrokeType(
  series: ApexAxisChartSeries,
): "straight" | "smooth" | "monotoneCubic" {
  const n = series.length > 0 ? series[0].data.length : 0;
  if (n > 144) {
    return "straight";
  } else if (n > 50) {
    return "smooth";
  }
  return "monotoneCubic";
}

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
          x: parse(item.timestamp, "yyyy-MM-dd HH:mm:ss", new Date()).getTime(),
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
  snapshots,
}: {
  slug: string;
  snapshots: Snapshot[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sources, setSources] = useState<ChartSourcesObject>({
    temperature: searchParams?.get("sources")?.includes("temperature") ?? false,
    voltage: searchParams?.get("sources")?.includes("voltage") ?? false,
    heating: searchParams?.get("sources")?.includes("heating") ?? false,
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
  const series = transformData(snapshots, sourcesFiltered);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: dateToStringDate(addDays(new Date(), -7)),
    to: dateToStringDate(new Date()),
  });

  const [chartSettings, setChartSettings] = useState<ChartSettingsObject>({
    strokeWidth: calculateStrokeWidth(series),
    strokeType: calculateStrokeType(series),
  });

  const eventColors: {
    [key: string]: { borderColor: string; fillColor: string };
  } = {
    Heating: {
      borderColor: "hsl(var(--heating))",
      fillColor: "hsl(var(--heating))",
    },
    Cooling: {
      borderColor: "hsl(var(--cooling))",
      fillColor: "hsl(var(--cooling))",
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

  const intervals = combineIntervals(generateIntervals(events));
  const filteredIntervals = intervals.filter((i) => {
    if (["heating", "cooling"].includes(i.type.toLowerCase())) {
      return sources.heating;
    }
    if (["doors"].includes(i.type.toLowerCase())) {
      return sources.doors;
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
        <ChartStats data={snapshots} />
      </div>
      <div className="mt-12 px-4 pb-2">
        <h2 className="mb-4 ml-1 text-3xl font-bold leading-6">Tabulka dat</h2>
        <LatestSnapshots
          snapshots={snapshots as Snapshot[]}
          take={100}
          showPagination={true}
        />
      </div>
    </>
  );
}
