import {
	type Snapshot,
	type SnapshotGroupNumeric,
	type SnapshotNumeric,
	type SnapshotStats,
	isSnapshotGroup,
} from "@/types/snapshot.types";
import { differenceInSeconds, parse } from "date-fns";

function isNumber(value: unknown): value is number {
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
			group.timestamp = null;
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function calculateAverageSnapshotGap(
	snapshots: Snapshot[],
): number | undefined {
	if (snapshots.length < 2) return undefined;

	const dates = snapshots.map((snapshot) => snapshot.timestamp);

	// Calculate gaps (in seconds) between consecutive timestamps
	const gapsInSeconds = [];
	for (let i = 1; i < dates.length; i++) {
		const gap = Math.abs(differenceInSeconds(dates[i], dates[i - 1]));
		gapsInSeconds.push(gap);
	}

	// Calculate the average gap
	const averageGapInSeconds =
		gapsInSeconds.reduce((acc, cur) => acc + cur, 0) / gapsInSeconds.length;

	return averageGapInSeconds;
}

export function calculatePercentageChange(
	oldValue: number,
	newValue: number,
): number {
	if (oldValue === 0) {
		return newValue > oldValue ? 100 : -100;
	}
	const percentageChange = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
	return percentageChange;
}

export function practicalMax(variable: string): number {
	return variable.includes("inside")
		? 36
		: variable.includes("outside")
			? 40
			: variable.includes("casing")
				? 45
				: variable.includes("top")
					? 60
					: variable.includes("bottom")
						? 60
						: variable.includes("in")
							? 16
							: variable.includes("battery")
								? 15
								: 50;
}
