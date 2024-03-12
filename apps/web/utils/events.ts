import { Event, Interval } from "@/types/event.types";
import { parse } from "date-fns";

export function translateEvent(str: string): string {
  switch (str) {
    case "Heating On":
      return "Zapnuto vyhřívání";
    case "Heating Off":
      return "Vypnuto vyhřívání";
    case "Cooling On":
      return "Zapnuto chlazení";
    case "Cooling Off":
      return "Vypnuto chlazení";
  }
  return "Neznámá událost";
}

function stringToDate(s: string): Date {
  return parse(s, "yyyy-MM-dd HH:mm:ss", new Date());
}

const eventKeywords: { [key: string]: { start: string[]; end: string[] } } = {
  Heating: { start: ["heating on"], end: ["heating off", "device on"] },
  Cooling: { start: ["cooling on"], end: ["cooling off", "device on"] },
  Doors: { start: ["doors opening"], end: ["doors closing", "device on"] },
};

export function generateIntervals(events: Event[]): Interval[] {
  const intervals: Interval[] = [];
  const startTimes: { [key: string]: Date } = {};

  for (const event of events) {
    event.event = event.event.toLowerCase();
    for (const eventType of Object.keys(eventKeywords)) {
      const { start, end } = eventKeywords[eventType];
      if (start.includes(event.event) && startTimes[eventType] === undefined) {
        startTimes[eventType] = stringToDate(event.timestamp);
      } else if (
        end.includes(event.event) &&
        startTimes[eventType] !== undefined
      ) {
        intervals.push({
          type: eventType,
          from: startTimes[eventType],
          to: stringToDate(event.timestamp),
        });
        delete startTimes[eventType];
      }
    }
  }

  // Check for incomplete intervals (device is on but not off yet)
  for (const eventType of Object.keys(startTimes)) {
    intervals.push({
      type: eventType,
      from: startTimes[eventType],
      to: new Date(),
    });
  }

  return intervals;
}

export function combineIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) {
    return [];
  }

  // Initialize an empty object to store combined intervals
  const combinedIntervalsMap: { [key: string]: Interval } = {};

  for (const interval of intervals) {
    let foundMatch = false;

    // Check for existing intervals that can be merged with the current interval
    for (const key of Object.keys(combinedIntervalsMap)) {
      const existingInterval = combinedIntervalsMap[key];

      // Check if the current interval can be merged with the existing interval
      if (
        interval.type === existingInterval.type &&
        (Math.abs(interval.from.getTime() - existingInterval.to.getTime()) <=
          300000 || // 5 minutes in milliseconds
          Math.abs(interval.to.getTime() - existingInterval.from.getTime()) <=
            300000)
      ) {
        // 5 minutes in milliseconds
        // Merge intervals
        existingInterval.from = new Date(
          Math.min(interval.from.getTime(), existingInterval.from.getTime()),
        );
        existingInterval.to = new Date(
          Math.max(interval.to.getTime(), existingInterval.to.getTime()),
        );
        combinedIntervalsMap[key] = existingInterval;
        foundMatch = true;
        break;
      }
    }

    // If no match found, add the interval as a new entry in the map
    if (!foundMatch) {
      combinedIntervalsMap[`${interval.from.getTime()}_${interval.type}`] = {
        ...interval,
      };
    }
  }
  // Convert combinedIntervalsMap values into an array and return
  const combinedIntervals: Interval[] = Object.values(combinedIntervalsMap);
  combinedIntervals.sort((a, b) => {
    if (a.from.getTime() !== b.from.getTime()) {
      return a.from.getTime() - b.from.getTime();
    } else if (a.to.getTime() !== b.to.getTime()) {
      return a.to.getTime() - b.to.getTime();
    } else {
      return a.type.localeCompare(b.type);
    }
  });

  return combinedIntervals;
}
