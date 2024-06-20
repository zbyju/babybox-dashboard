import { Snapshot } from "./snapshot.types";
import { z } from "zod"

export type BabyboxBase = {
  slug: string;
  name: string;
};

export type BabyboxDetail = BabyboxBase & {
  location?: BabyboxAddress;
  network_configuration?: BabyboxNetworkConfiguration;
};

export type BabyboxData = BabyboxBase & {
  lastData: Snapshot;
};

export type BabyboxAddress = {
  hospital?: string;
  city?: string;
  postcode?: string;
  street?: string;

  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type BabyboxContact = {
  id: string;
  firstname: string;
  lastname: string;
  position: string;
  email?: string;
  phone?: string;
  note?: string;
};

export type BabyboxNetworkType = "vlan" | "lan" | "routing" | "custom";

export type BabyboxNetworkConfiguration = {
  type: BabyboxNetworkType;
  ip_addresses: {
    router: string;
    engine_unit: string;
    thermal_unit: string;
    camera: string;
    pc: string;
    gateway: string;
  };
  note?: string;
};

export type BabyboxMaintenance = {
  timestamp: Date;
  note?: string;
};

export type BabyboxIssue = {
  id?: string;
  timestamp: Date;
  slug: string;
  priority: string;
  severity: string;
  assignee: string;
  issue: BabyboxIssueDescription;
  createdAt: Date;
  isSolved: boolean;
  solvedAt?: Date | undefined;
}

export type BabyboxIssueDescription = {
  type: string;
  subtype: string;
  description: string;
  context: string;
}

const requiredLabel = "Povinné"

export const BabyboxIssueDescriptionSchema = z.object({
  type: z.string().min(1, requiredLabel),
  subtype: z.string().min(1, requiredLabel),
  description: z.string().optional(),
  context: z.string().optional(),
});

export const BabyboxIssueSchema = z.object({
  timestamp: z.date({
    required_error: requiredLabel,
  }),
  slug: z.string({
    required_error: requiredLabel
  }).min(1, requiredLabel),
  priority: z.string().min(1, requiredLabel),
  severity: z.string().min(1, requiredLabel),
  assignee: z.string().optional(),
  issue: BabyboxIssueDescriptionSchema,
  isSolved: z.boolean(),
  solvedAt: z.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "Špatné datum" : defaultError,
    }),
  }).optional(),
}).refine(data => data.solvedAt === undefined || data.isSolved, {
  message: "Chyba má uvedené datum, kdy byla vyřešena, ale je označena jako nevyřešená.",
  path: ["isSolved"],
});