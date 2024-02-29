// snapshotUtils.test.ts
import {
  calculateSnapshotStats,
  transformToSnapshotNumeric,
  transformToSnapshotsNumeric,
} from "./stats"; // Adjust the import path based on your project structure

describe("Snapshot utilities", () => {
  it("should transform snapshots to only contain numeric variables", () => {
    const snapshots = [
      {
        timestamp: "2024-02-28T12:00:00Z",
        var1: 100,
        group1: {
          var2: 200,
          var3: "non-numeric",
          var4: new Date(),
          var5: true,
          var6: undefined,
        },
        group2: {},
      },
      {
        timestamp: "2024-02-28T13:00:00Z",
        var1: 400,
        group1: { var3: "string", var2: 500 },
        group2: {},
      },
    ];
    const numericSnapshots = transformToSnapshotsNumeric(snapshots);
    expect(numericSnapshots).toEqual([
      { var1: 100, group1: { var2: 200 } },
      { var1: 400, group1: { var2: 500 } },
    ]);
  });

  it("should calculate stats correctly for numeric variables", () => {
    const snapshots = [
      {
        timestamp: "2024-02-28T12:00:00Z",
        var1: 100,
        group1: { var2: 200, var3: "non-numeric" },
      },
      {
        timestamp: "2024-02-28T13:00:00Z",
        var1: 400,
        group1: { var2: 500, var3: "string" },
      },
    ];
    const stats = calculateSnapshotStats(snapshots);
    expect(stats).toEqual({
      var1: { min: 100, max: 400, average: 250 },
      group1: { var2: { min: 200, max: 500, average: 350 } },
    });
  });
});
