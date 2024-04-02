import { Snapshot } from "@/types/snapshot.types";
import { calculateAverageSnapshotGap } from "@/utils/stats";
import { formatDistanceToNow, parse } from "date-fns";
import { cs } from "date-fns/locale";

interface Props {
  snapshots: Snapshot[];
  take: number;
}

export default function TextualSnapshotStats(props: Props) {
  if (props.snapshots.length === 0) return null;
  const snapshotsFirst = props.snapshots.slice(0, props.take || 5);
  const averageGap =
    calculateAverageSnapshotGap(snapshotsFirst)?.toFixed(0) ?? 0;
  const lastSnapshotGap = formatDistanceToNow(
    parse(snapshotsFirst[0].timestamp, "yyyy-MM-dd HH:mm:ss", new Date()),
    { locale: cs },
  );
  return (
    <div className="flex flex-col leading-5">
      {snapshotsFirst.length > 0 ? (
        <>
          <span>Zobrazeno {snapshotsFirst.length} záznamů.</span>
          <span>Poslední záznam je {lastSnapshotGap} starý.</span>
          <span>Průměrná doba mezi příchodem dat je {averageGap} sekund.</span>
        </>
      ) : null}
    </div>
  );
}
