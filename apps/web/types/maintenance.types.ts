import { requiredLabel } from "./labels";
import { z } from "zod";

export const BabyboxMaintenanceStateSchema = z
  .enum(["open", "completed", "unknown"])
  .default("unknown");

export const BabyboxMaintenanceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, requiredLabel),
  assignee: z.string().optional(),
  slug: z.string(),
  note: z.string().optional(),
  distance: z.coerce.number().optional(),
  start: z.coerce.date({
    error: requiredLabel,
  }),
  end: z.coerce.date().optional(),
  state: BabyboxMaintenanceStateSchema,
});

export const BabyboxMaintenancesSchema = z.array(BabyboxMaintenanceSchema);

export type BabyboxMaintenance = z.infer<typeof BabyboxMaintenanceSchema>;
export type BabyboxMaintenanceState = z.infer<
  typeof BabyboxMaintenanceStateSchema
>;
