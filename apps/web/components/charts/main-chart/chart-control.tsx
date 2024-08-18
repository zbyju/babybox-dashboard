import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import ChartSettings, { ChartSettingsObject } from "./chart-settings";
import ChartSources, { ChartSourcesObject } from "./chart-sources";
import TimeFilter, { DateRange } from "./time-filter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import Link from "next/link";

interface Props {
  slug: string;

  sources: ChartSourcesObject;
  onSourcesChange: (val: ChartSourcesObject) => unknown;

  chartSettings: ChartSettingsObject;
  onSettingsChange: (val: ChartSettingsObject) => unknown;

  dateRange: DateRange;
  onDateRangeChange: (val: DateRange) => unknown;
}

function getParams(link: string): string {
  const split = link.split("?");
  if (split.length < 2) return "";
  return split[1];
}

export default function ChartControl(props: Props) {
  const { babyboxes } = useContext(BabyboxesContext);
  const currentIdx =
    babyboxes && babyboxes.length > 0
      ? babyboxes.findIndex((b) => b.slug === props.slug)
      : 0;
  const prevSlug =
    babyboxes && babyboxes.length > 0
      ? babyboxes[(currentIdx - 1 + babyboxes.length) % babyboxes.length].slug
      : props.slug;
  const nextSlug =
    babyboxes && babyboxes.length > 0
      ? babyboxes[(currentIdx + 1) % babyboxes.length].slug
      : props.slug;
  const params = getParams(window.location.href);

  return (
    <div className="flex flex-row flex-wrap justify-between gap-4">
      <div className="flex flex-row flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold">
          <span className="text-pink-600 dark:text-pink-700">Babybox </span>
          {babyboxes[currentIdx].name}
        </h3>
        <TimeFilter
          dateRange={props.dateRange}
          onChange={props.onDateRangeChange}
        />
        <ChartSources
          sources={props.sources}
          onChange={props.onSourcesChange}
        />
        <ChartSettings
          settings={props.chartSettings}
          onChange={props.onSettingsChange}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Link href={`/dashboard/babybox/${prevSlug}/chart?${params}`}>
          <Button
            variant="outline"
            size="lg"
            className="inline-flex flex-row gap-2"
          >
            <ArrowLeft size="24" />
            Předchozí
          </Button>
        </Link>
        <Link href={`/dashboard/babybox/${nextSlug}/chart?${params}`}>
          <Button
            variant="outline"
            size="lg"
            className="inline-flex flex-row gap-2"
          >
            Další
            <ArrowRight size="24" />
          </Button>
        </Link>
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
    </div>
  );
}
