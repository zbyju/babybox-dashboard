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
    return r.json();
  });

export const snapshotFetcher = async (
  url: string,
  token: string,
): Promise<Snapshot[] | null> => {
  try {
    const res = await fetcherWithToken(url, token);

    if (!res || !res.data || !Array.isArray(res.data)) return null;

    return res.data.map((d: Snapshot) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
  } catch (err) {
    return null;
  }
};

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
