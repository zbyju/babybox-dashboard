export interface Snapshot {
  timestamp: string;
  [key: string]: SnapshotGroup | SnapshotVariable;
}

export interface SnapshotGroup {
  [key: string]: SnapshotVariable;
}

export type SnapshotVariable = string | number | boolean | Date | undefined;

export function isSnapshotGroup(value: any): value is SnapshotGroup {
  // Check if the value is an object and not null, not Date and not Array
  if (
    typeof value === "object" &&
    value !== null &&
    value !== undefined &&
    !(value instanceof Date) &&
    !Array.isArray(value)
  ) {
    return true;
  }
  return false;
}

export interface SnapshotNumeric {
  [key: string]: SnapshotGroupNumeric | SnapshotVariableNumeric;
}

export interface SnapshotGroupNumeric {
  [key: string]: number;
}

export type SnapshotVariableNumeric = number;

export interface SnapshotStats {
  [key: string]: SnapshotGroupNumeric | SnapshotVariableStat;
}

export interface SnapshotVariableStat {
  min: number;
  max: number;
  average: number;
}

export function isSnapshotVariableStat(
  value: any,
): value is SnapshotVariableStat {
  return (
    value &&
    typeof value === "object" &&
    "min" in value &&
    "max" in value &&
    "average" in value
  );
}
