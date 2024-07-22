import { Snapshot, SnapshotGroupStat } from "@/types/snapshot.types";
import VariableStats from "@/components/widgets/variable-stats";
import { calculateSnapshotStats } from "@/utils/stats";
import Widget from "@/components/ui/widget";

interface Props {
  data: Snapshot[];
}

export default function ChartStats(props: Props) {
  if (props.data.length === 0)
    return (
      <div className="flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
        <h5>Žádné data</h5>
      </div>
    );
  const stats = calculateSnapshotStats(props.data);

  const temperatureWidgets = [
    { key: "inside", label: "Vnitřní teplota" },
    { key: "outside", label: "Venkovní teplota" },
    { key: "casing", label: "Teplota pláště" },
    { key: "top", label: "Horní teplota" },
    { key: "bottom", label: "Spodní teplota" },
  ].map((v) => (
    <Widget
      key={v.key}
      title={v.label}
      className="mx-auto"
      classNameInner={`border-b-4 border-b-${v.key}`}
    >
      {stats.temperature && (stats.temperature as SnapshotGroupStat)[v.key] ? (
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat)[v.key]}
        />
      ) : (
        <p>Žádné statistiky.</p>
      )}
    </Widget>
  ));

  const voltageWidgets = [
    { key: "in", label: "Napětí vstupní" },
    { key: "battery", label: "Napětí baterie" },
  ].map((v) => (
    <Widget
      key={v.key}
      title={v.label}
      className="mx-auto"
      classNameInner={`border-b-4 border-b-${v.key}`}
    >
      {stats.voltage && (stats.voltage as SnapshotGroupStat)[v.key] ? (
        <VariableStats stats={(stats.voltage as SnapshotGroupStat)[v.key]} />
      ) : (
        <p>Žádné statistiky.</p>
      )}
    </Widget>
  ));

  return (
    <div className="flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
      {temperatureWidgets}
      {voltageWidgets}
    </div>
  );
}
