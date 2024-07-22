import {
  BabyboxIssue,
  BabyboxIssueSchema,
  BabyboxIssuesSchema,
} from "@/types/issue.types";
import { ApiResponse, ApiResponseSchema } from "@/types/api.types";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

export const updateBabyboxIssue = async (
  issue: BabyboxIssue,
  token: string,
): Promise<BabyboxIssue> => {
  try {
    // Validate the issue object before sending
    BabyboxIssueSchema.parse(issue);

    if (!issue.id) {
      throw new Error("Issue ID is required for updating");
    }

    const response = await axios.put<ApiResponse>(
      `${babyboxServiceURL}/v2/issues/${issue.id}`,
      issue,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Validate the API response
    const validatedResponse = ApiResponseSchema.parse(response.data);

    if (validatedResponse.metadata.err) {
      throw new Error(validatedResponse.metadata.message);
    }

    // Validate that the returned data is a valid BabyboxIssue
    const validatedIssue = BabyboxIssueSchema.parse(validatedResponse.data);

    return validatedIssue;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    } else if (error instanceof AxiosError) {
      throw new Error(`API request failed: ${error.message}`);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export async function issuesFetcher(token: string, suffix: string = "") {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const url = `${babyboxServiceURL}/v1/issues${suffix}`;
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
