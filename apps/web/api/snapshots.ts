import { Snapshot, Snapshot2, SnapshotSchema } from "@/types/snapshot.types";
import z from "zod";

export type FetchSnapshotsParams = {
  slugs?: string[];
  timestamp?: string; // RFC3339
  limit?: number;
  token: string;
};

const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;

export const fetchNearSnapshots = async ({
  slugs,
  timestamp,
  limit,
  token,
}: FetchSnapshotsParams): Promise<Snapshot2[]> => {
  const params = new URLSearchParams();
  if (slugs?.length) params.append("slugs", slugs.join(","));
  if (timestamp) params.append("timestamp", timestamp);
  if (limit) params.append("limit", limit.toString());

  const response = await fetch(
    `${snapshotServiceURL}/v1/snapshots/near?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch snapshots");
  }

  const data = await response.json();
  // Validates the array against our schema
  return z.array(SnapshotSchema).parse(data);
};
