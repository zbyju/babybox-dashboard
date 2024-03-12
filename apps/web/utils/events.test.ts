import { Event, Interval } from "@/types/event.types";
import { parse } from "date-fns";

import { combineIntervals, generateIntervals } from "./events";

describe("generateIntervals function", () => {
  it("should generate intervals for only heating events", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 12:00:00", event: "Heating off" },
    ];

    const expectedIntervals: Interval[] = [
      {
        type: "Heating",
        from: parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
    ];

    expect(generateIntervals(events)).toEqual(expectedIntervals);
  });

  it("should generate intervals for heating, cooling, and doors events", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 12:00:00", event: "Heating off" },
      { timestamp: "2024-03-10 14:00:00", event: "Cooling on" },
      { timestamp: "2024-03-10 16:00:00", event: "Cooling off" },
      { timestamp: "2024-03-10 18:00:00", event: "Doors opening" },
      { timestamp: "2024-03-10 20:00:00", event: "Doors closing" },
    ];

    const expectedIntervals: Interval[] = [
      {
        type: "Heating",
        from: parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Cooling",
        from: parse("2024-03-10 14:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 16:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Doors",
        from: parse("2024-03-10 18:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 20:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
    ];

    expect(generateIntervals(events)).toEqual(expectedIntervals);
  });

  // Test for device on at the end
  it("should generate intervals when device on event is at the end", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 12:00:00", event: "Heating off" },
      { timestamp: "2024-03-10 14:00:00", event: "Cooling on" },
      { timestamp: "2024-03-10 16:00:00", event: "Cooling off" },
      { timestamp: "2024-03-10 18:00:00", event: "Doors opening" },
      { timestamp: "2024-03-10 20:00:00", event: "Doors closing" },
      { timestamp: "2024-03-10 22:00:00", event: "Device on" },
    ];

    const expectedIntervals: Interval[] = [
      {
        type: "Heating",
        from: parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Cooling",
        from: parse("2024-03-10 14:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 16:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Doors",
        from: parse("2024-03-10 18:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 20:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
    ];

    expect(generateIntervals(events)).toEqual(expectedIntervals);
  });

  // Test for device on randomly in the middle
  it("should generate intervals when device on event is randomly in the middle", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 12:00:00", event: "Heating off" },
      { timestamp: "2024-03-10 14:00:00", event: "Cooling on" },
      { timestamp: "2024-03-10 15:30:00", event: "Device on" },
      {
        timestamp: "2024-03-10 16:00:00",
        event: "Cooling off",
      },
      { timestamp: "2024-03-10 18:00:00", event: "Doors opening" },
      { timestamp: "2024-03-10 20:00:00", event: "Doors closing" },
    ];

    const expectedIntervals: Interval[] = [
      {
        type: "Heating",
        from: parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Cooling",
        from: parse("2024-03-10 14:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 15:30:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
      {
        type: "Doors",
        from: parse("2024-03-10 18:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 20:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
    ];

    expect(generateIntervals(events)).toEqual(expectedIntervals);
  });

  // Test for no events
  it("should return an empty array when there are no events", () => {
    const events: Event[] = [];

    expect(generateIntervals(events)).toEqual([]);
  });

  // Test for single device on event
  it("should return an empty array when there is only a single device on event", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Device on" },
    ];

    expect(generateIntervals(events)).toEqual([]);
  });

  // Test for single device off event
  it("should return an empty array when there is only a single device off event", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Device off" },
    ];

    expect(generateIntervals(events)).toEqual([]);
  });

  // Test for multiple consecutive heating on events followed by one heating off
  // event
  it("should generate intervals for multiple consecutive heating on events followed by one heating off event", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 12:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 14:00:00", event: "Heating on" },
      { timestamp: "2024-03-10 16:00:00", event: "Heating off" },
    ];

    const expectedIntervals: Interval[] = [
      {
        type: "Heating",
        from: parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
        to: parse("2024-03-10 16:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      },
    ];

    expect(generateIntervals(events)).toEqual(expectedIntervals);
  });

  it("should include the start of the heating until now for incomplete heating interval", () => {
    const events: Event[] = [
      { timestamp: "2024-03-10 10:00:00", event: "Heating on" },
      // No heating off event yet
    ];

    const generatedIntervals = generateIntervals(events);
    const currentTime = new Date();

    // Check if the generated interval has the correct type and starts at the expected time
    expect(generatedIntervals[0].type).toBe("Heating");
    expect(generatedIntervals[0].from).toEqual(
      parse("2024-03-10 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
    );

    // Check if the difference between the generated end time and the current time is within an acceptable epsilon value (e.g., 1 minute)
    const epsilon = 60 * 1000; // 1 minute in milliseconds
    const timeDifference = Math.abs(
      generatedIntervals[0].to.getTime() - currentTime.getTime(),
    );
    expect(timeDifference).toBeLessThanOrEqual(epsilon);
  });
});

describe("combineIntervals function", () => {
  it("should combine intervals correctly", () => {
    const intervals: Interval[] = [
      {
        type: "Heating",
        from: new Date("2024-03-10T12:00:00"),
        to: new Date("2024-03-10T14:00:00"),
      },
      {
        type: "Heating",
        from: new Date("2024-03-10T14:00:00"),
        to: new Date("2024-03-10T17:00:00"),
      },
    ];

    const combinedIntervals: Interval[] = combineIntervals(intervals);

    const expectedCombinedIntervals: Interval[] = [
      {
        type: "Heating",
        from: new Date("2024-03-10T12:00:00"),
        to: new Date("2024-03-10T17:00:00"),
      },
    ];

    expect(combinedIntervals).toEqual(expectedCombinedIntervals);
  });
  it("should combine intervals that are separated by another interval of different kind", () => {
    const intervals: Interval[] = [
      {
        type: "Heating",
        from: new Date("2024-03-10T12:00:00"),
        to: new Date("2024-03-10T14:00:00"),
      },
      {
        type: "Cooling",
        from: new Date("2024-03-10T14:00:00"),
        to: new Date("2024-03-10T16:00:00"),
      },
      {
        type: "Heating",
        from: new Date("2024-03-10T14:00:00"),
        to: new Date("2024-03-10T17:00:00"),
      },
    ];

    const combinedIntervals: Interval[] = combineIntervals(intervals);

    const expectedCombinedIntervals: Interval[] = [
      {
        type: "Heating",
        from: new Date("2024-03-10T12:00:00"),
        to: new Date("2024-03-10T17:00:00"),
      },
      {
        type: "Cooling",
        from: new Date("2024-03-10T14:00:00"),
        to: new Date("2024-03-10T16:00:00"),
      },
    ];

    expect(combinedIntervals).toEqual(expectedCombinedIntervals);
  });

  it("should handle empty input", () => {
    const intervals: Interval[] = [];

    const combinedIntervals: Interval[] = combineIntervals(intervals);

    expect(combinedIntervals).toEqual([]);
  });

  it("should handle single interval", () => {
    const intervals: Interval[] = [
      {
        type: "Heating",
        from: new Date("2024-03-10T12:00:00"),
        to: new Date("2024-03-10T14:00:00"),
      },
    ];

    const combinedIntervals: Interval[] = combineIntervals(intervals);

    expect(combinedIntervals).toEqual(intervals);
  });

  // Add more test cases as needed
});
