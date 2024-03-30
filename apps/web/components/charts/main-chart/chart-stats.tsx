import Widget from "@/components/ui/widget";
import VariableStats from "@/components/widgets/variable-stats";
import { Snapshot, SnapshotGroupStat } from "@/types/snapshot.types";
import { calculateSnapshotStats } from "@/utils/stats";

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

  return (
    <div className="flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
      <Widget
        title="Vnitřní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-inside"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Venkovní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-outside"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).outside}
        />
      </Widget>
      <Widget
        title="Teplota Pláště"
        className="mx-auto"
        classNameInner="border-b-4 border-b-casing"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).casing}
        />
      </Widget>
      <Widget
        title="Horní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-heating"
      >
        <VariableStats stats={(stats.temperature as SnapshotGroupStat).top} />
      </Widget>
      <Widget
        title="Spodní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-cooling"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).bottom}
        />
      </Widget>
      <Widget
        title="Vstupní napětí"
        className="mx-auto"
        classNameInner="border-b-4 border-b-in"
      >
        <VariableStats stats={(stats.voltage as SnapshotGroupStat).in} />
      </Widget>
      <Widget
        title="Napětí akumulátor"
        className="mx-auto"
        classNameInner="border-b-4 border-b-battery"
      >
        <VariableStats stats={(stats.voltage as SnapshotGroupStat).battery} />
      </Widget>
    </div>
  );
}
