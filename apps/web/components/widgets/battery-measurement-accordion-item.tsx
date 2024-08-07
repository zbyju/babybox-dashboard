import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { BatteryMeasurement } from "@/types/battery-measurement.types";
import LineChart from "../charts/line-chart";
import { format, parseISO } from "date-fns";
import { Badge } from "../ui/badge";

interface Props {
  batteryMeasurement: BatteryMeasurement;
}

export default function BatteryMeasurementAccordionItem({
  batteryMeasurement,
}: Props) {
  const measurements = batteryMeasurement.measurements.map((x) => ({
    timestamp: parseISO(x[0]),
    battery: x[1],
  }));
  const seriesData = measurements.map((m) => ({
    x: m.timestamp.getTime(),
    y: m.battery,
  }));

  const badge =
    batteryMeasurement.quality === 5 ? (
      <Badge className="hover:bg-initial bg-green-500 dark:bg-green-600">
        Výborná
      </Badge>
    ) : batteryMeasurement.quality === 4 ? (
      <Badge className="hover:bg-initial bg-emerald-500 dark:bg-teal-600">
        Dobrá
      </Badge>
    ) : batteryMeasurement.quality === 3 ? (
      <Badge className="hover:bg-initial bg-yellow-500 dark:bg-yellow-600">
        Uspokojivá
      </Badge>
    ) : batteryMeasurement.quality === 2 ? (
      <Badge className="hover:bg-initial bg-orange-500 dark:bg-orange-600">
        Špatná
      </Badge>
    ) : batteryMeasurement.quality === 1 ? (
      <Badge className="hover:bg-initial bg-red-500 dark:bg-red-600">
        Poruchová
      </Badge>
    ) : (
      <Badge className="hover:bg-initial bg-slate-500 dark:bg-slate-600">
        Neznámá kvalita ({batteryMeasurement.quality})
      </Badge>
    );

  return (
    <>
      <AccordionItem value={batteryMeasurement._id}>
        <AccordionTrigger className="px-2">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <div className="min-w-[120px]">{badge}</div>
            <h3 className="text-xl">
              {format(measurements[0].timestamp, "dd.MM.yyyy HH:mm")}
            </h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <LineChart
            id={batteryMeasurement._id}
            max={15.5}
            min={10.5}
            strokeWidth={3}
            xaxisType="datetime"
            annotations={{}}
            showToolbar={false}
            showLegend={false}
            series={[
              {
                name: "Napětí baterie",
                color: "hsl(var(--battery))",
                data: seriesData,
              },
            ]}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
