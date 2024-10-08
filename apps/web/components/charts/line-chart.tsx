"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Chart from "react-apexcharts";
import { cs } from "date-fns/locale";
import { format } from "date-fns";

interface Props {
  id: string;
  annotations: ApexAnnotations;
  series: ApexAxisChartSeries;
  xaxisType: "category" | "datetime" | "numeric";
  title?: string;
  zoom?: boolean;
  showToolbar?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXaxisLabels?: boolean;
  showXaxisTicks?: boolean;
  strokeWidth?: number;
  xAxisFormat?: string;
  strokeType?: "straight" | "smooth" | "monotoneCubic" | "stepline";
  forecastNumber?: number;
  min?: number;
  max?: number;
}

export default function LineChart(props: Props) {
  const [display, setDisplay] = useState<boolean>(false);
  const theme = useTheme().resolvedTheme || "dark";

  useEffect(() => {
    setDisplay(false);
    setTimeout(() => setDisplay(true), 1);
  }, []);

  if (props.series.length === 0 || display === false) {
    return (
      <div className="flex h-full max-h-full w-full overflow-x-hidden overflow-y-hidden">
        <h4 className="mx-auto self-center text-center text-3xl">
          Žádné data!
        </h4>
      </div>
    );
  }

  const defaultConfig = {
    zoom: false,
    showToolbar: true,
    showGrid: false,
    showLegend: true,
    strokeWidth: 1,
    strokeType: "straight" as const,
    showTooltip: true,
    showXaxisLabels: true,
    showXaxisTicks: true,
    xAxisFormat: "d.M.yy HH:mm",
    min: undefined,
    max: undefined,
  };

  const config = { ...defaultConfig, ...props };

  const markerSize = 0;

  const state = {
    options: {
      chart: {
        id: config.id,
        zoom: {
          enabled: config.zoom,
        },
        animations: {
          enabled: false,
        },
        toolbar: {
          show: config.showToolbar,
          tools: {
            zoomin:
              '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
            zoomout:
              '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
            zoom: '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-2 mt-[2px] ml-[3px]"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
            pan: '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-horizontal"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" x2="22" y1="12" y2="12"/></svg>',
            reset:
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw mt-[1px]"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
            download: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--foreground))" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
          },
        },
      },
      tooltip: {
        enabled: config.showTooltip,
        theme: theme,
        x: {
          format: "dd.MM.yyyy HH:mm",
          formatter: (val: number) =>
            format(val, "dd.MM.yyyy HH:mm:ss", { locale: cs }),
        },
      },
      grid: {
        show: config.showGrid,
        borderColor: "hsl(var(--border))",
      },
      legend: {
        show: config.showLegend,
        labels: {
          colors: "hsl(var(--muted-foreground))",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: config.xaxisType,
        labels: {
          show: config.showXaxisLabels,
          format: config.xAxisFormat,
          formatter: (val: string) =>
            format(val, config.xAxisFormat, { locale: cs }),
        },
        axisBorder: {
          offsetX: -1,
          color: "hsl(var(--primary))",
        },
        axisTicks: {
          show: config.showXaxisTicks,
          offsetX: -1,
          color: "hsl(var(--primary))",
        },
        crosshairs: {
          stroke: {
            color: "hsl(var(--primary))",
          },
        },
      },
      yaxis: {
        showAlways: true,
        min: config.min,
        max: config.max,
        labels: {
          style: {
            colors: "hsl(var(--muted-foreground))",
          },
          formatter: (val: unknown) =>
            typeof val === "number" ? val.toFixed(1) : (val as string),
        },
        axisBorder: {
          show: true,
          offsetX: -2,
          color: "hsl(var(--primary))",
        },
        axisTicks: {
          show: true,
          color: "hsl(var(--primary))",
        },
      },
      stroke: {
        curve: config.strokeType,
        width: config.strokeWidth,
      },
      title: {
        text: config.title,
        style: {
          color: "hsl(var(--foreground))",
        },
      },
      markers: {
        size: markerSize,
        strokeColors: "hsl(var(--border))",
        strokeWidth: 0,
      },
      forecastDataPoints: {
        count: config.forecastNumber,
      },
      annotations: config.annotations,
    },
    series: config.series,
  };

  return (
    <div className="h-full max-h-full w-full overflow-x-hidden overflow-y-hidden">
      <Chart
        options={state.options}
        series={state.series}
        width="100%"
        height="100%"
      />
    </div>
  );
}
