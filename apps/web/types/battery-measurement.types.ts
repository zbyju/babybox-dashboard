export interface BatteryMeasurement {
  id: string;
  slug: string;
  quality: number;
  measurements: [string, number][];
}
