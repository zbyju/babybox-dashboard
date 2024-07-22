import { z } from "zod";

export const ApiResponseSchema = z.object({
  data: z.any(),
  metadata: z.object({
    err: z.boolean(),
    message: z.string(),
  }),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
