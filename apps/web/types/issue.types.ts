import { requiredLabel } from "./labels";
import { z } from "zod";

export const IssueStateSchema = z.enum([
  "open",
  "planned",
  "in_progress",
  "closed",
  "solved",
  "created",
  "unknown",
]);

export type IssueState = z.infer<typeof IssueStateSchema>;

export const BabyboxIssueDescriptionSchema = z.object({
  type: z.string().min(1, requiredLabel),
  subtype: z.string().min(1, requiredLabel),
  description: z.string().optional(),
  context: z.string().optional(),
});

export const BabyboxIssueStateUpdateSchema = z.object({
  state: IssueStateSchema,
  timestamp: z.coerce.date({
    error: requiredLabel,
  }),
  username: z.string().optional(),
});

export const BabyboxIssueCommentSchema = z.object({
  text: z.string().min(1, requiredLabel),
  timestamp: z.coerce.date({
    error: requiredLabel,
  }),
  username: z.string().optional(),
});

export const BabyboxIssueSchema = z.object({
  id: z.string().optional(),
  maintenance_id: z.string().optional(),
  slug: z.string({ error: requiredLabel }).min(1, requiredLabel),
  title: z.string().min(1, requiredLabel),
  priority: z.string().optional(),
  severity: z.string().optional(),
  assignee: z.string().optional(),
  issue: BabyboxIssueDescriptionSchema,
  state_history: z.array(BabyboxIssueStateUpdateSchema).default([]),
  comments: z.array(BabyboxIssueCommentSchema).default([]),
});

export const BabyboxIssuesSchema = z.array(BabyboxIssueSchema);

export type BabyboxIssue = z.infer<typeof BabyboxIssueSchema>;

export const IssueFiltersSchema = z.object({
  title: z.string().default("").optional(),
  slug: z.string().default("").optional(),
  status: z.array(z.string()).default([]),
  priority: z.array(z.string()).default([]),
  severity: z.array(z.string()).default([]),
  type: z.array(z.string()).default([]),
  maintenanceFilter: z.enum(["assigned", "not_assigned", "all"]).default("all"),
  time: z
    .object({
      to: z.coerce.date().optional(),
      from: z.coerce.date().optional(),
    })
    .optional(),
});

export type IssueFilters = z.infer<typeof IssueFiltersSchema>;
