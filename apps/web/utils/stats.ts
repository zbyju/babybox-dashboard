import {
  Snapshot,
  SnapshotGroupNumeric,
  SnapshotNumeric,
  SnapshotStats,
  isSnapshotGroup,
} from "@/types/snapshot.types";

function isNumber(value: any): value is number {
  return typeof value === "number";
}

export function transformToSnapshotNumeric(
  snapshot: Snapshot,
): SnapshotNumeric {
  const result: SnapshotNumeric = {};

  for (const key in snapshot) {
    const value = snapshot[key];
    if (isNumber(value)) {
      result[key] = value;
    } else if (isSnapshotGroup(value)) {
      const group = value;
      group.timestamp = "";
      const transformed = transformToSnapshotNumeric(
        group as Snapshot,
      ) as SnapshotGroupNumeric;
      if (Object.keys(transformed).length > 0) {
        result[key] = transformed;
      }
    }
  }

  return result;
}

export function transformToSnapshotsNumeric(snapshots: Snapshot[]) {
  return snapshots.map((snapshot) => transformToSnapshotNumeric(snapshot));
}

export function calculateSnapshotStats(snapshots: Snapshot[]): SnapshotStats {
  const snapshotsNumeric = transformToSnapshotsNumeric(snapshots);
  const stats: any = {};

  const updateStats = (key: string, value: number, groupKey?: string) => {
    const targetStats = groupKey ? stats[groupKey][key] : stats[key];
    targetStats.min = Math.min(targetStats.min ?? value, value);
    targetStats.max = Math.max(targetStats.max ?? value, value);
    targetStats.average = {
      sum: (targetStats.average?.sum ?? 0) + value,
      count: (targetStats.average?.count ?? 0) + 1,
    };
  };

  for (const snapshot of snapshotsNumeric) {
    for (const key in snapshot) {
      const value = snapshot[key];
      if (isNumber(value)) {
        if (!stats[key]) stats[key] = {};
        updateStats(key, value);
      } else {
        const group = value;
        for (const subKey in group) {
          const subValue = group[subKey];
          stats[key] = stats[key] || {};
          stats[key][subKey] = stats[key][subKey] || {};
          updateStats(subKey, subValue, key);
        }
      }
    }
  }

  for (const key in stats) {
    if (stats[key].average) {
      stats[key].average = stats[key].average.sum / stats[key].average.count;
    } else {
      for (const subKey in stats[key]) {
        const subStat = stats[key][subKey];
        subStat.average = subStat.average.sum / subStat.average.count;
      }
    }
  }

  return stats;
}
