import { requiredLabel } from "./labels";
import { z } from "zod";

export const BabyboxMaintenanceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, requiredLabel),
  assignee: z.string().optional(),
  slug: z.string().optional(),
  note: z.string().optional(),
  distance: z.coerce.number().optional(),
  start: z.coerce.date({
    required_error: requiredLabel,
  }),
  end: z.coerce.date().optional(),
  state: z.string().min(1, requiredLabel),
});

export const BabyboxMaintenancesSchema = z.array(BabyboxMaintenanceSchema);

export type BabyboxMaintenance = z.infer<typeof BabyboxMaintenanceSchema>;
