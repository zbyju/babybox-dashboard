import {
  snapshotQueryToSnapshot,
  isTypeOfSnapshotQuery,
} from "shared/utils/snapshot";
import { ApiResponse } from "../types/response.types";
import { findBabyboxOrCreate } from "../service/babybox.service";
import { createSnapshot } from "../service/snapshot.service";

export const handleIncomingSnapshot = (
  query: unknown
): Promise<ApiResponse> => {
  return new Promise(async (resolve, _) => {
    if (!isTypeOfSnapshotQuery(query))
      return resolve({
        status: 400,
        msg: "ERROR - Snapshot is either missing or in wrong format.",
      });
    const snapshot = snapshotQueryToSnapshot(query);
    const babyboxId = await findBabyboxOrCreate(snapshot.babyboxName);
    const newSnapshot = await createSnapshot(snapshot, babyboxId);

    console.log("Created snapshot: ", newSnapshot);

    return resolve({
      status: 200,
      msg: "Successfully saved the snapshot.",
    });
  });
};
