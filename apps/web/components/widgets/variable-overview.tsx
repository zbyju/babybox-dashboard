"use client";

import { Snapshot, SnapshotVariableStat } from "@/types/snapshot.types";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { calculatePercentageChange } from "@/utils/stats";
import LineChart from "../charts/line-chart";
import { DataTable } from "../ui/data-table";

interface Source {
  group: string;
  variable: string;
  name: string;
  color: string;
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
          x: item.timestamp.getTime(),
          // @ts-expect-error apex
          y: item[group][variable],
        };
      }),
    });
  });

  return series;
}

interface Stats {
  name: string;
  min: number;
  average: number;
  max: number;
}

const minavgmaxColumns = [
  { key: "min", name: "Min" },
  { key: "average", name: "Průměr" },
  { key: "max", name: "Max" },
].map((c) => {
  return {
    accessorKey: c.key,
    header: () => <div className="">{c.name}</div>,
    cell: ({
      getValue,
      table,
      row,
    }: {
      getValue: () => unknown;
      table: Table<Stats>;
      row: Row<Stats>;
    }) => {
      const val = getValue();
      const str = typeof val === "number" ? val.toFixed(2) : val;

      const currentIndex = row.index;
      const currentValue = row.getValue(c.key) as number;
      const previousValue =
        currentIndex > 0
          ? (table
              .getRowModel()
              .rows[currentIndex - 1].getValue(c.key) as number)
          : undefined;

      const percentageChange = previousValue
        ? calculatePercentageChange(previousValue, currentValue)
        : 0;

      const arrow =
        percentageChange > 1 ? (
          <ArrowUpRight size={16} className="text-red-600 dark:text-red-700" />
        ) : percentageChange < -1 ? (
          <ArrowDownRight
            size={16}
            className="text-blue-600 dark:text-blue-700"
          />
        ) : (
          <Minus size={16} className="text-slate-700 dark:text-slate-400" />
        );

      return (
        <div className="flex flex-row items-center gap-0">
          {str as string} {arrow || ""}
        </div>
      );
    },
  };
});

const columns: ColumnDef<Stats>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">Období</div>,
  },
  ...minavgmaxColumns,
];

export default function VariableOverview({
  lastWeek,
  last3Days,
  lastDay,
  snapshots,
  source,
}: {
  source: Source;
  lastWeek: SnapshotVariableStat;
  last3Days: SnapshotVariableStat;
  lastDay: SnapshotVariableStat;
  snapshots: Snapshot[];
}) {
  const latestSnapshots = snapshots.slice(0, 10);
  const series = transformData(latestSnapshots, [source]);
  const tableData = [
    { name: "Týden", ...lastWeek },
    { name: "3 dny", ...last3Days },
    { name: "Den", ...lastDay },
  ];

  return (
    <div className="flex max-w-[360px] flex-col justify-center gap-0 px-1">
      <div className="ml-[-18px] mt-[-22px]">
        <LineChart
          id={`${source.group}-${source.variable}-variable-overview`}
          annotations={{}}
          series={series}
          xaxisType="datetime"
          showToolbar={false}
          showGrid={false}
          showLegend={false}
          showTooltip={false}
          showXaxisLabels={false}
          showXaxisTicks={false}
          strokeType="smooth"
          strokeWidth={5}
        />
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        sorting={[]}
        className="ghost"
      />
    </div>
  );
}
