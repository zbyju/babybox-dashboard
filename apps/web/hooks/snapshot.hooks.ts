import { queryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchNearSnapshots, FetchSnapshotsParams } from "@/api/snapshots.api";
import { useAuth } from "@/components/contexts/auth-context";
import { getMsUntilNextHeartbeat } from "@/utils/heartbeat";

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
    refetchInterval: (_query) => {
      // If the query is successful, wait until the next heartbeat to check again
      return getMsUntilNextHeartbeat();
    },
    refetchIntervalInBackground: true,
  });
};

export function useNearSnapshots({
  slugs,
  timestamp,
  limit = 1,
}: UseNearSnapshotsProps = {}) {
  const { token, isLoaded } = useAuth();

  return useQuery({
    ...snapshotOptions({
      token: isLoaded ? token : null,
      slugs,
      timestamp,
      limit,
    }),
  });
}
