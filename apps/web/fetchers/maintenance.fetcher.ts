import {
  BabyboxMaintenance,
  BabyboxMaintenanceSchema,
} from "@/types/maintenance.types";
import { ApiResponse, ApiResponseSchema } from "@/types/api.types";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

export const createBabyboxMaintenance = async (
  maintenance: BabyboxMaintenance,
  issueIds: string[],
  token: string,
): Promise<BabyboxMaintenance> => {
  try {
    // Validate the maintenance object before sending
    BabyboxMaintenanceSchema.parse(maintenance);

    const response = await axios.post<ApiResponse>(
      `${babyboxServiceURL}/v1/maintenances`,
      { maintenance, issues: issueIds },
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

    // Validate that the returned data is a valid BabyboxMaintenance
    const validatedMaintenance = BabyboxMaintenanceSchema.parse(
      validatedResponse.data,
    );

    return validatedMaintenance;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error}`);
    } else if (error instanceof AxiosError) {
      throw new Error(`API request failed: ${error.message}`);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export async function maintenanceFetcher(token: string, id: string) {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const url = `${babyboxServiceURL}/v1/maintenances/${id}`;
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

    const parsedMaintenance = BabyboxMaintenanceSchema.safeParse(data);
    if (!parsedMaintenance.success) {
      throw new Error(
        `Invalid maintenances format: ${JSON.stringify(parsedMaintenance.error.errors)}`,
      );
    }

    return parsedMaintenance.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch issues: ${error}`);
  }
}
