import Widget from "@/components/ui/widget";
import VariableStats from "@/components/widgets/variable-stats";
import { Snapshot, SnapshotGroupStat } from "@/types/snapshot.types";
import { calculateSnapshotStats } from "@/utils/stats";

interface Props {
  data: Snapshot[];
}

export default function ChartStats(props: Props) {
  const stats = calculateSnapshotStats(props.data);

  return (
    <div className="flex flex-row flex-wrap gap-4">
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
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Teplota Pláště"
        className="mx-auto"
        classNameInner="border-b-4 border-b-casing"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Horní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-heating"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Spodní teplota"
        className="mx-auto"
        classNameInner="border-b-4 border-b-cooling"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Vstupní napětí"
        className="mx-auto"
        classNameInner="border-b-4 border-b-in"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget
        title="Napětí akumulátor"
        className="mx-auto"
        classNameInner="border-b-4 border-b-battery"
      >
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
    </div>
  );
}
