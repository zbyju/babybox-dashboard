import { SnapshotVariableStat } from "@/types/snapshot.types";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function VariableStats({
  stats,
}: {
  stats: SnapshotVariableStat;
}) {
  return (
    <div className="flex flex-col justify-center gap-0 px-1">
      <div className="flex flex-col items-center justify-end gap-0">
        <p className="inline-flex items-end text-5xl font-bold tracking-tighter dark:font-bold">
          {stats.average.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center gap-0 text-blue-900 dark:text-blue-300 dark:opacity-90">
          <ArrowDown size={24} />
          <p className="inline-flex items-end text-3xl font-semibold tracking-tighter dark:font-semibold">
            {stats.min.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-0 text-red-700 dark:text-red-300 dark:opacity-90">
          <p className="inline-flex items-end text-3xl font-semibold tracking-tighter dark:font-semibold">
            {stats.max.toFixed(2)}
          </p>
          <ArrowUp size={24} className="self-center" />
        </div>
      </div>
    </div>
  );
}
