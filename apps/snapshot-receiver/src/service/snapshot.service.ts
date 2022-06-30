import { Snapshot } from "shared/types/snapshot.types";
import { prisma } from "../server";

export const createSnapshot = async (snapshot: Snapshot, babyboxId: string) => {
  return prisma.snapshot.create({
    data: {
      babyboxId: babyboxId,
      status: snapshot.status,
      temperature: snapshot.temperature,
      voltage: snapshot.voltage,
      time: snapshot.receivedTime,
      version: "Unknown",
    },
  });
};
