import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { BadgeAlert, BadgeCheck, BadgeX } from "lucide-react";
import { calculateAverageSnapshotGap } from "@/utils/stats";
import { Snapshot } from "@/types/snapshot.types";
import { cs } from "date-fns/locale";

interface Props {
  snapshots: Snapshot[];
  take: number;
}

export default function TextualSnapshotStats(props: Props) {
  if (props.snapshots.length === 0) return null;
  const snapshotsFirst = props.snapshots.slice(0, props.take || 5);
  const averageGap = calculateAverageSnapshotGap(snapshotsFirst);
  const lastSnapshotGapMinutes = Math.abs(
    differenceInMinutes(new Date(), snapshotsFirst[0].timestamp),
  );
  const lastSnapshotGapStr = formatDistanceToNow(snapshotsFirst[0].timestamp, {
    locale: cs,
  });

  const iconsClass = "w-5 h-5";
  const oldIcon =
    lastSnapshotGapMinutes > 60 ? (
      <BadgeX className={iconsClass + " text-destructive"} />
    ) : lastSnapshotGapMinutes > 10 ? (
      <BadgeAlert
        className={iconsClass + " text-orange-600 dark:text-orange-400"}
      />
    ) : (
      <BadgeCheck className={iconsClass + " text-success"} />
    );
  const gapIcon =
    !averageGap || averageGap > 3600 ? (
      <BadgeX className={iconsClass + " text-destructive"} />
    ) : averageGap > 700 ? (
      <BadgeAlert
        className={iconsClass + " text-orange-600 dark:text-orange-400"}
      />
    ) : (
      <BadgeCheck className={iconsClass + " text-success"} />
    );

  return (
    <div className="flex flex-col leading-5">
      {snapshotsFirst.length > 0 ? (
        <>
          <span>Zobrazeno {snapshotsFirst.length} záznamů.</span>
          <span className="inline-flex flex-row items-center gap-1">
            {oldIcon}
            Poslední záznam je {lastSnapshotGapStr} starý.
          </span>
          <span className="inline-flex flex-row items-center gap-1">
            {gapIcon}
            Průměrná doba mezi příchodem dat je {averageGap?.toFixed(2) ??
              0}{" "}
            sekund.
          </span>
        </>
      ) : null}
    </div>
  );
}
