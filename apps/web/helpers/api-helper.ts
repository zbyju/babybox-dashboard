import { ApiResponse } from "@/types/api.types";
import { BabyboxBase, BabyboxDetail } from "@/types/babybox.types";
import { Snapshot } from "@/types/snapshot.types";

export const API_SNAPSHOT_HANDLER = "http://snapshot-handler:8080/v1";
export const API_BABYBOX_SERVICE = "http://babybox-service:8081/v1";
export const API_USER_SERVICE = "http://babybox-service:8082/v1";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const fetcherWithToken = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => {
    console.log(r);
    console.log(token);
    return r.json();
  });

export const authenticateUser = async (
  username: string,
  password: string,
): Promise<{ token: string } | Error> => {
  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;

  try {
    const response = await fetch(`${userServiceURL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return Promise.resolve({ token: data.data.token });
    } else {
      const data = await response.json();
      return Promise.reject(data.metadata.message);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function fetchBabyboxNames(token: string): Promise<BabyboxBase[]> {
  try {
    const response = await fetch(API_BABYBOX_SERVICE + "/babyboxes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return Promise.reject("API error");
    }

    const data: ApiResponse<BabyboxBase[]> = await response.json();
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
