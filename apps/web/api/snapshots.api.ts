import { SnapshotsWithSlug } from "@/types/snapshot.types";
import { ApiSchema } from "@/api/common.api";
import z from "zod";

export type FetchSnapshotsParams = {
  slugs?: string[];
  timestamp?: string; // RFC3339
  limit?: number;
  token: string | null;
};

const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;

export const fetchNearSnapshots = async ({
  slugs,
  timestamp,
  limit,
  token,
}: FetchSnapshotsParams): Promise<SnapshotsWithSlug[]> => {
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
  const apiResult = ApiSchema.safeParse(data);

  if (!apiResult.success) {
    throw new Error(apiResult.error.message);
  }

  if (apiResult.data.metadata.err) {
    throw new Error(apiResult.data.metadata.message);
  }

  const res = z.array(SnapshotsWithSlug).safeParse(apiResult.data.data);
  if (!res.success) {
    throw new Error(res.error.message);
  }

  return res.data;
};
