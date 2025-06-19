import {
  BabyboxIssue,
  BabyboxIssueSchema,
  BabyboxIssuesSchema,
} from "@/types/issue.types";
import { ApiResponseSchema } from "@/types/api.types";
import { Snapshot } from "@/types/snapshot.types";
import axios from "axios";

const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const fetcherWithToken = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => {
    return r.json();
  });

export const fetcherMultipleWithToken = async (
  urls: string[],
  token: string,
) => {
  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())
    )
  );

  return results
    .filter((result): result is PromiseFulfilledResult<unknown> => result.status === "fulfilled")
    .map((result) => result.value);
};

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

export const refreshToken = async (
  token: string,
): Promise<{ token: string } | Error> => {
  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;

  try {
    const response = await fetch(`${userServiceURL}/v1/auth/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const updateIssue = async (
  issue: BabyboxIssue,
  token: string,
): Promise<BabyboxIssue> => {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

  try {
    const response = await fetch(`${babyboxServiceURL}/v1/issues/${issue.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!("data" in data)) throw new Error("Data not returned from API");

    return data.data as BabyboxIssue;
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
};

export async function issuesFetcher(token: string, slug?: string) {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const url =
      slug === undefined
        ? `${babyboxServiceURL}/v1/issues`
        : `${babyboxServiceURL}/v1/issues/slug/${slug}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const parsedResponse = ApiResponseSchema.safeParse(response.data);

    if (!parsedResponse.success) {
      throw new Error("Invalid response format");
    }

    const { data, metadata } = parsedResponse.data;

    if (metadata.err) {
      throw new Error(`API Error: ${metadata.message}`);
    }

    const parsedIssues = BabyboxIssuesSchema.safeParse(data);
    if (!parsedIssues.success) {
      throw new Error(
        `Invalid issues format: ${JSON.stringify(parsedIssues.error.errors)}`,
      );
    }

    return parsedIssues.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch issues: ${error}`);
  }
}

export async function issueFetcher(token: string, id: string) {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const url = `${babyboxServiceURL}/v1/issues/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const parsedResponse = ApiResponseSchema.safeParse(response.data);

    if (!parsedResponse.success) {
      throw new Error("Invalid response format");
    }

    const { data, metadata } = parsedResponse.data;

    if (metadata.err) {
      throw new Error(`API Error: ${metadata.message}`);
    }

    const parsedIssue = BabyboxIssueSchema.safeParse(data);
    if (!parsedIssue.success) {
      throw new Error(
        `Invalid issues format: ${JSON.stringify(parsedIssue.error.errors)}`,
      );
    }

    return parsedIssue.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch issues: ${error}`);
  }
}
