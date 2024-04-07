import { Event, EventDecoded, Interval } from "@/types/event.types";
import { parse } from "date-fns";

export function translateEvent(str: string): string {
  switch (str.toLowerCase()) {
    case "te0000":
      return "JT - spuštěn";
    case "te0101":
      return "JT - start topení plašť";
    case "te0100":
      return "JT - konec topení plášť";
    case "te0201":
      return "JT - start topení pelt";
    case "te0200":
      return "JT - konec topení pelt";
    case "te0301":
      return "JT - start chlazení";
    case "te0300":
      return "JT - konec chlazení";
    case "te0401":
      return "JT - start větrák horní";
    case "te0400":
      return "JT - konec větrák horní";
    case "te0501":
      return "JT - start větrák dolní";
    case "te0500":
      return "JT - konec větrák dolní";
  }
  return "Neznámá událost";
}

function stringToDate(s: string): Date {
  return parse(s, "yyyy-MM-dd HH:mm:ss", new Date());
}

const eventKeywords: { [key: string]: { start: string[]; end: string[] } } = {
  HeatingCasing: {
    start: ["te0101"],
    end: ["te0100", "te0000"],
  },
  Heating: {
    start: ["te0201"],
    end: ["te0200", "te0000"],
  },
  Cooling: {
    start: ["te0301"],
    end: ["te0300", "te0000"],
  },
  FanTop: {
    start: ["te0401"],
    end: ["te0400", "te0000"],
  },
  FanBottom: {
    start: ["te0501"],
    end: ["te0500", "te0000"],
  },
};

export function decodeEvent(event: Event): EventDecoded {
  const eventCode = `${event.unit[0].toLowerCase()}e${event.event_code}`;
  const translated = translateEvent(eventCode);
  return {
    slug: event.slug,
    timestamp: event.timestamp,
    event: eventCode,
    label: translated,
  };
}

export function generateIntervals(events: EventDecoded[]): Interval[] {
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
          label: eventType,
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
      label: eventType,
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
