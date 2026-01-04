import z from "zod";

export const SnapshotSchema = z.object({
  slug: z.string(),
  version: z.number(),
  timestamp: z.iso.datetime(), // InfluxDB RFC3339 strings
  temperature: z.object({
    inside: z.number().nullable(),
    outside: z.number().nullable(),
    casing: z.number().nullable(),
    top: z.number().nullable(),
    bottom: z.number().nullable(),
  }),
  voltage: z.object({
    in: z.number().nullable(),
    battery: z.number().nullable(),
  }),
});
export type Snapshot2 = z.infer<typeof SnapshotSchema>;

export const SnapshotsWithSlug = z.object({
  slug: z.string(),
  snapshots: z.array(SnapshotSchema),
});
export type SnapshotsWithSlug = z.infer<typeof SnapshotsWithSlug>;

// LEGACY
export interface Snapshot {
  timestamp: Date;
  [key: string]: SnapshotGroup | SnapshotVariable;
}

export interface SnapshotGroup {
  [key: string]: SnapshotVariable;
}

export type SnapshotVariable =
  | string
  | number
  | boolean
  | Date
  | undefined
  | null;

export function isSnapshotGroup(value: unknown): value is SnapshotGroup {
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
  [key: string]: SnapshotVariableNumeric;
}

export type SnapshotVariableNumeric = number;

export interface SnapshotStats {
  [key: string]: SnapshotGroupStat | SnapshotVariableStat;
}

export interface SnapshotGroupStat {
  [key: string]: SnapshotVariableStat;
}

export interface SnapshotVariableStat {
  min: number;
  max: number;
  average: number;
}

export function isSnapshotVariableStat(
  value: unknown,
): value is SnapshotVariableStat {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    "min" in value &&
    "max" in value &&
    "average" in value
  );
}
