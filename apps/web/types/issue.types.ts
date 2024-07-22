import { requiredLabel } from "./labels";
import { z } from "zod";

export const BabyboxIssueDescriptionSchema = z.object({
  type: z.string().min(1, requiredLabel),
  subtype: z.string().min(1, requiredLabel),
  description: z.string().optional(),
  context: z.string().optional(),
});

export const BabyboxIssueStateUpdateSchema = z.object({
  state: z.string().min(1, requiredLabel),
  timestamp: z.coerce.date({
    required_error: requiredLabel,
  }),
  username: z.string().optional(),
});

export const BabyboxIssueCommentSchema = z.object({
  text: z.string().min(1, requiredLabel),
  timestamp: z.coerce.date({
    required_error: requiredLabel,
  }),
  username: z.string().optional(),
});

export const BabyboxIssueSchema = z.object({
  id: z.string().optional(),
  maintenance_id: z.string().optional(),
  slug: z.string({ required_error: requiredLabel }).min(1, requiredLabel),
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

export type IssueState =
  | "open"
  | "planned"
  | "in_progress"
  | "closed"
  | "solved"
  | "unknown";

export const IssueFiltersSchema = z.object({
  title: z.string().default("").optional(),
  slug: z.string().default("").optional(),
  status: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  severity: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  time: z
    .object({
      to: z.coerce.date().optional(),
      from: z.coerce.date().optional(),
    })
    .optional(),
});

export type IssueFilters = z.infer<typeof IssueFiltersSchema>;
