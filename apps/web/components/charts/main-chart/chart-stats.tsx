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
      <Widget title="Vnitřní teplota">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Venkovní teplota">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Teplota Pláště">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Horní teplota">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Spodní teplota">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Vstupní napětí">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
      <Widget title="Napětí akumulátor">
        <VariableStats
          stats={(stats.temperature as SnapshotGroupStat).inside}
        />
      </Widget>
    </div>
  );
}
