import z from "zod";

export const ApiSuccessSchema = z.object({
  data: z.unknown(),
  metadata: z.object({
    err: z.literal(false),
    message: z.string(),
  }),
});
export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;

export const ApiErrorSchema = z.object({
  data: z.null,
  metadata: z.object({
    err: z.literal(true),
    message: z.string(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiSchema = z.union([ApiSuccessSchema, ApiErrorSchema]);
