"use client";

import { events } from "../../../../../data/heating_cooling_events";
import { snapshots } from "../../../../../data/snapshots";
import ChartControl from "@/components/charts/main-chart/chart-control";
import LineChart from "@/components/charts/line-chart";
import ChartStats from "@/components/charts/main-chart/chart-stats";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot } from "@/types/snapshot.types";
import { parse } from "date-fns";
import { useState } from "react";
import { ChartSourcesObject } from "@/components/charts/main-chart/chart-sources";
import { ChartSettingsObject } from "@/components/charts/main-chart/chart-settings";

export default function Home({ params }: { params: { slug: string } }) {
  function calculateStrokeWidth(series: ApexAxisChartSeries): number {
    const n = series.length > 0 ? series[0].data.length : 0;
    if (n > 1000) {
      return 1;
    } else if (n > 500) {
      return 2;
    } else if (n > 250) {
      return 3;
    } else if (n > 100) {
      return 4;
    } else if (n > 50) {
      return 5;
    } else {
      return 6;
    }
  }

  function transformData(
    originalData: Snapshot[],
    fieldsToExtract: { group: string; variable: string; name: string }[],
  ): ApexAxisChartSeries {
    const series: ApexAxisChartSeries = [];
    fieldsToExtract.forEach(({ group, variable, name }) => {
      series.push({
        name: name,
        data: originalData.map((item) => {
          return {
            x: parse(
              item.timestamp,
              "yyyy-MM-dd HH:mm:ss",
              new Date(),
            ).getTime(),
            y: (item[group] as any)[variable],
          };
        }),
      });
    });

    return series;
  }

  const [sources, setSources] = useState<ChartSourcesObject>({
    temperature: true,
    voltage: true,
    heating: true,
    doors: false,
    temperatureSetting: false,
    sun: false,
  });

  const sourcesFiltered = [
    { group: "temperature", variable: "inside", name: "Vnitřní teplota" },
    { group: "temperature", variable: "outside", name: "Venkovní teplota" },
    { group: "temperature", variable: "casing", name: "Teplota pláště" },
    { group: "temperature", variable: "top", name: "Horní teplota" },
    { group: "temperature", variable: "bottom", name: "Spodní teplota" },
    { group: "voltage", variable: "in", name: "Vstupní napětí" },
    { group: "voltage", variable: "battery", name: "Napětí baterie" },
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

  const [chartSettings, setChartSettings] = useState<ChartSettingsObject>({
    strokeWidth: calculateStrokeWidth(series),
    strokeType: "smooth",
  });

  return (
    <div className="h-[92vh] min-h-[400px]">
      <div className="mb-5 flex h-full w-full flex-col gap-6">
        <LineChart
          id="main-chart"
          series={series}
          annotations={{} as ApexAnnotations}
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
            onSourcesChange={setSources}
            chartSettings={chartSettings}
            onSettingsChange={setChartSettings}
            slug={params.slug}
          />
        </div>
      </div>
      <div className="mb-5 border-t border-t-border px-4 pt-5">
        <h2 className="ml-1 text-3xl font-bold leading-6">Statistiky</h2>
        <h3 className="mb-6 ml-1 text-muted-foreground">Z vybraného období</h3>
        <ChartStats data={snapshots} />
      </div>
      <div className="mt-12 px-4 pb-10">
        <h2 className="mb-4 ml-1 text-3xl font-bold leading-6">Tabulka dat</h2>
        <LatestSnapshots snapshots={snapshots as Snapshot[]} take={100} />
      </div>
    </div>
  );
}
