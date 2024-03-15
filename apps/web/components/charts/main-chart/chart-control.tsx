import { Button } from "@/components/ui/button";
import ChartSettings, { ChartSettingsObject } from "./chart-settings";
import Link from "next/link";
import TimeFilter, { DateRange } from "./time-filter";
import { ArrowLeft } from "lucide-react";
import ChartSources, { ChartSourcesObject } from "./chart-sources";

interface Props {
  slug: string;

  sources: ChartSourcesObject;
  onSourcesChange: (val: ChartSourcesObject) => unknown;

  chartSettings: ChartSettingsObject;
  onSettingsChange: (val: ChartSettingsObject) => unknown;

  dateRange: DateRange;
  onDateRangeChange: (val: DateRange) => unknown;
}

export default function ChartControl(props: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <TimeFilter
        dateRange={props.dateRange}
        onChange={props.onDateRangeChange}
      />
      <ChartSources sources={props.sources} onChange={props.onSourcesChange} />
      <ChartSettings
        settings={props.chartSettings}
        onChange={props.onSettingsChange}
      />
      <Link href={"/dashboard/babybox/" + props.slug}>
        <Button
          variant="outline"
          size="lg"
          className="inline-flex flex-row gap-2"
        >
          <ArrowLeft size="24" />
          Zpět
        </Button>
      </Link>
    </div>
  );
}
