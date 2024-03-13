"use client";

import { useTheme } from "next-themes";
import Chart from "react-apexcharts";

export default function TestChart() {
  const theme = useTheme().resolvedTheme || "dark";

  const state = {
    options: {
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 0,
          opacityFrom: 0.9,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      chart: {
        id: "basic-bar",
        zoom: false,
        toolbar: {
          show: false,
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
        theme: theme,
      },
      grid: {
        show: false,
        borderColor: "hsl(var(--border))",
      },
      legend: {
        show: false,
        labels: {
          colors: "hsl(var(--muted-foreground))",
        },
      },
      xaxis: {
        type: "numeric",
        labels: {
          style: {
            colors: "hsl(var(--muted-foreground))",
          },
        },
        axisBorder: {
          offsetX: -1,
          color: "hsl(var(--primary))",
        },
        axisTicks: {
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
        type: "numeric",
        showAlways: true,
        labels: {
          style: {
            colors: "hsl(var(--muted-foreground))",
          },
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
        curve: "smooth",
        width: "3",
      },
      colors: [
        "hsl(var(--inside))",
        "hsl(var(--outside))",
        "hsl(var(--casing))",
        "hsl(var(--heating))",
        "hsl(var(--cooling))",
        "hsl(var(--in))",
        "hsl(var(--battery))",
      ],
      title: {
        text: undefined,
        style: {
          color: "hsl(var(--foreground))",
        },
      },
      markers: {
        colors: [
          "hsl(var(--inside))",
          "hsl(var(--outside))",
          "hsl(var(--casing))",
          "hsl(var(--heating))",
          "hsl(var(--cooling))",
          "hsl(var(--in))",
          "hsl(var(--battery))",
        ],
        strokeColors: "hsl(var(--border))",
      },
      forecastDataPoints: {
        count: 0,
      },
      annotations: {
        yaxis: [
          {
            y: 33,
            borderColor: "hsl(var(--heating))",
            label: {
              text: "Threshold",
            },
          },
        ],
        xaxis: [
          {
            x: 2,
            borderColor: "hsl(var(--primary))",
            label: {
              text: "Event",
            },
          },
          {
            x: 0.2,
            x2: 1,
            fillColor: "hsl(var(--heating))",
            label: {
              text: "Heating",
            },
          },
        ],
      },
    },
    series: [
      {
        name: "Vnitrni",
        type: "area",
        data: [
          { x: 0, y: 34 },
          { x: 1, y: 31 },
          { x: 2, y: 31 },
          { x: 3, y: 31 },
          { x: 4, y: 33 },
        ],
      },
      {
        name: "Venkovni",
        type: "area",
        data: [
          { x: 0, y: 12 },
          { x: 1, y: 14 },
          { x: 2, y: 13 },
          { x: 3, y: 22 },
          { x: 4, y: 17 },
        ],
      },
      {
        name: "Plast",
        type: "area",
        data: [
          { x: 0, y: 16 },
          { x: 1, y: 19 },
          { x: 2, y: 7 },
          { x: 3, y: 28 },
          { x: 4, y: 24 },
        ],
      },
      {
        name: "Horni",
        type: "area",
        data: [
          { x: 0, y: 34 },
          { x: 1, y: 48 },
          { x: 2, y: 52 },
          { x: 3, y: 34 },
          { x: 4, y: 30 },
        ],
      },
      {
        name: "Spodni",
        type: "area",
        data: [
          { x: 0, y: 17 },
          { x: 1, y: 9 },
          { x: 2, y: 7 },
          { x: 3, y: 6 },
          { x: 4, y: 12 },
        ],
      },
      {
        name: "Vstup",
        type: "area",
        data: [
          { x: 0, y: 12 },
          { x: 1, y: 12 },
          { x: 2, y: 13 },
          { x: 3, y: 12 },
          { x: 4, y: 14 },
        ],
      },
      {
        name: "Baterie",
        type: "area",
        data: [
          { x: 0, y: 11 },
          { x: 1, y: 11 },
          { x: 2, y: 11 },
          { x: 3, y: 12 },
          { x: 4, y: 11 },
        ],
      },
    ],
  };

  return (
    <div className="ml-[-10px] mt-[-20px] h-full max-h-full w-full overflow-x-hidden overflow-y-hidden">
      <Chart
        // @ts-expect-error test
        options={state.options}
        series={state.series}
        type="line"
        width="100%"
        height="100%"
      />
    </div>
  );
}
