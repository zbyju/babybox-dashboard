import { Snapshot, SnapshotQuery } from "../types/snapshot.types";
import { calculateStatus } from "./status";

export const isTypeOfSnapshotQuery = (
  unknown: unknown
): unknown is SnapshotQuery => {
  return (
    typeof unknown === "object" &&
    unknown !== null &&
    "BB" in unknown &&
    "T0" in unknown &&
    "T1" in unknown &&
    "T2" in unknown &&
    "T3" in unknown &&
    "T4" in unknown &&
    "T5" in unknown &&
    "T6" in unknown &&
    "T7" in unknown
  );
};

export const snapshotQueryToSnapshot = (
  query: SnapshotQuery,
  receivedTime: Date = new Date()
): Snapshot => {
  const snapshotWithoutStatus = {
    receivedTime,
    babyboxName: query.BB,
    temperature: {
      inner: Number(parseInt(query.T0).toFixed(2)),
      outside: Number(parseInt(query.T1).toFixed(2)),
      bottom: Number(parseInt(query.T2).toFixed(2)),
      top: Number(parseInt(query.T3).toFixed(2)),
      casing: Number(parseInt(query.T7).toFixed(2)),
    },
    voltage: {
      battery: Number(parseInt(query.T5).toFixed(2)),
      in: Number(parseInt(query.T6).toFixed(2)),
    },
  };
  const snapshot = {
    ...snapshotWithoutStatus,
    status: calculateStatus(snapshotWithoutStatus),
  };
  return snapshot;
};
