import { queryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchNearSnapshots, FetchSnapshotsParams } from "@/api/snapshots";
import { useAuth } from "@/components/contexts/auth-context";
import { getMsUntilNextHeartbeat } from "@/utils/heartbeat";
import { Snapshot2 } from "@/types/snapshot.types";

interface UseNearSnapshotsProps {
  slugs?: string[];
  timestamp?: string;
  limit?: number;
}

export const snapshotOptions = (params: FetchSnapshotsParams) => {
  return queryOptions({
    // Unique key based on parameters
    queryKey: [
      "snapshots",
      "near",
      params.slugs,
      params.timestamp,
      params.limit,
    ],
    queryFn: () => fetchNearSnapshots(params),
    // Only run the query if we have a valid token
    enabled: !!params.token,
    staleTime: getMsUntilNextHeartbeat(),
    refetchInterval: (query) => {
      // If the query is successful, wait until the next heartbeat to check again
      return getMsUntilNextHeartbeat();
    },
    refetchIntervalInBackground: true,
  });
};

export function useNearSnapshots({
  slugs,
  timestamp,
  limit = 1, // Default limit as per requirements
}: UseNearSnapshotsProps = {}) {
  const { token, isLoaded } = useAuth();

  // We use the reusable snapshotOptions we defined earlier
  return useQuery({
    ...snapshotOptions({
      token,
      slugs,
      timestamp,
      limit,
    }),
  });
}
