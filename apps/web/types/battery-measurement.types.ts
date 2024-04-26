export interface BatteryMeasurement {
  _id: string;
  slug: string;
  quality: number;
  measurements: [string, number][];
}
