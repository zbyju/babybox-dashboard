import { Button } from "@/components/ui/button";
import ChartSettings, { ChartSettingsObject } from "./chart-settings";
import Link from "next/link";
import TimeFilter from "./time-filter";
import { ArrowLeft } from "lucide-react";
import ChartSources, { ChartSourcesObject } from "./chart-sources";

interface Props {
  slug: string;

  sources: ChartSourcesObject;
  onSourcesChange: (val: ChartSourcesObject) => any;

  chartSettings: ChartSettingsObject;
  onSettingsChange: (val: ChartSettingsObject) => any;
}

export default function ChartControl(props: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <TimeFilter />
      <ChartSources sources={props.sources} onChange={props.onSourcesChange} />
      <ChartSettings
        settings={props.chartSettings}
        onChange={props.onSettingsChange}
      />
      <Link href={"/app/babybox/" + props.slug}>
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
