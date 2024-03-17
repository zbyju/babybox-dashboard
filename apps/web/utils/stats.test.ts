// snapshotUtils.test.ts
import { Snapshot } from "@/types/snapshot.types";
import {
  calculateAverageSnapshotGap,
  calculatePercentageChange,
  calculateSnapshotStats,
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

describe("calculateAverageGap", () => {
  test("calculates the average gap for timestamps with equal gaps", () => {
    const snapshots = [
      { timestamp: "2024-03-17 08:00:00" },
      { timestamp: "2024-03-17 08:00:10" },
      { timestamp: "2024-03-17 08:00:20" },
    ];
    const averageGap = calculateAverageSnapshotGap(snapshots);
    expect(averageGap).toBe(10);
  });

  test("calculates the average gap for timestamps with varying gaps", () => {
    const snapshots = [
      { timestamp: "2024-03-17 08:00:00" },
      { timestamp: "2024-03-17 08:00:10" },
      { timestamp: "2024-03-17 08:00:30" },
    ];
    const averageGap = calculateAverageSnapshotGap(snapshots);
    expect(averageGap).toBe(15);
  });

  test("returns undefined for a single timestamp", () => {
    const snapshots = [{ timestamp: "2024-03-17 08:00:00" }];
    const averageGap = calculateAverageSnapshotGap(snapshots);
    expect(averageGap).toBe(undefined);
  });

  test("returns undefined for an empty array", () => {
    const snapshots: Snapshot[] = [];
    const averageGap = calculateAverageSnapshotGap(snapshots);
    expect(averageGap).toBe(undefined);
  });
});

// calculatePercentageChange.test.ts
describe("calculatePercentageChange", () => {
  test("calculates positive percentage change correctly", () => {
    expect(calculatePercentageChange(100, 150)).toBe(50.0);
  });

  test("calculates negative percentage change correctly", () => {
    expect(calculatePercentageChange(100, 50)).toBe(-50.0);
  });

  test("calculates zero percentage change correctly", () => {
    expect(calculatePercentageChange(100, 100)).toBe(0.0);
  });

  test("calculates percentage change correctly with negative old value increasing", () => {
    expect(calculatePercentageChange(-100, -50)).toBe(50.0);
  });

  test("calculates percentage change correctly with negative old value decreasing", () => {
    expect(calculatePercentageChange(-100, -150)).toBe(-50.0);
  });
});
