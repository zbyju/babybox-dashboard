export type Event = {
  timestamp: string;
  event: string;
};

export interface Interval {
  type: string;
  from: Date;
  to: Date;
}
