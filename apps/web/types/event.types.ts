export type Event = {
  slug: string;
  timestamp: string;
  unit: string;
  event_code: number;
};

export interface Interval {
  type: string;
  label: string;
  from: Date;
  to: Date;
}

export type EventDecoded = {
  slug: string;
  timestamp: string;
  event: string;
  label: string;
};
