import { Snapshot } from "./snapshot.types";

export type BabyboxBase = {
  slug: string;
  name: string;
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
  name: string;
  email?: string;
  phone?: string;
  note?: string;
};

export type BabyboxNetworkConfiguration = {
  type: "vlan" | "lan" | "routing" | "custom";
  ip: {
    router: string;
    engineUnit: string;
    thermalUnit: string;
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
