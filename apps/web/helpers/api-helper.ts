import { Babybox } from "@/components/tables/babyboxes-table";
import { ApiResponse } from "@/types/api.types";
import { BabyboxBase, BabyboxDetail } from "@/types/babybox.types";
import { Snapshot } from "@/types/snapshot.types";

export const API_SNAPSHOT_HANDLER = "http://snapshot-handler:8080/v1";
export const API_BABYBOX_SERVICE = "http://babybox-service:8081/v1";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export async function fetchBabyboxNames(): Promise<BabyboxBase[]> {
  try {
    const response = await fetch(API_BABYBOX_SERVICE + "/babyboxes");
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<BabyboxBase[]> = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function fetchBabyboxDetail(slug: string): Promise<BabyboxDetail> {
  try {
    const response = await fetch(API_BABYBOX_SERVICE + "/babyboxes/" + slug);
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<BabyboxDetail> = await response.json();
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function fetchAllSnapshots(): Promise<Snapshot[]> {
  try {
    const response = await fetch(API_SNAPSHOT_HANDLER + "/snapshots");
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<Snapshot[]> = await response.json();
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function fetchSnapshotsBySlug(slug: string): Promise<Snapshot[]> {
  try {
    const response = await fetch(API_SNAPSHOT_HANDLER + "/snapshots/" + slug);
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<Snapshot[]> = await response.json();
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function fetchSnapshotsBySlugAndTime(
  slug: string,
  from: string,
  to: string,
): Promise<Snapshot[]> {
  try {
    const response = await fetch(
      `${API_SNAPSHOT_HANDLER}/snapshots/${slug}?from=${from}&to=${to}`,
    );
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<Snapshot[]> = await response.json();
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function fetchSnapshotsBySlugAndN(
  slug: string,
  n: number,
): Promise<Snapshot[]> {
  try {
    const response = await fetch(
      `${API_SNAPSHOT_HANDLER}/snapshots/${slug}?n=${n}`,
    );
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<Snapshot[]> = await response.json();
    return data.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
