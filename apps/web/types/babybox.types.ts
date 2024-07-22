import { Snapshot } from "./snapshot.types";
import { z } from "zod";

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
    latitude: number | string;
    longitude: number | string;
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
