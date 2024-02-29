export interface ChartAnnotations {
  xaxis: ChartAnnotationsXAxis[];
  yaxis: ChartAnnotationsYAxis[];
}

export interface ChartAnnotationsAxis {
  text: string;
  color: string;
  color2: string;
}

export interface ChartAnnotationsXAxis extends ChartAnnotationsAxis {
  x: number;
  x2?: number;
}
export interface ChartAnnotationsYAxis extends ChartAnnotationsAxis {
  y: number;
  y2?: number;
}

export type ChartColors = string[];

export type ChartDataPoint = number | { x: number; y: number };
export interface ChartSerie {
  name: string;
  data: ChartDataPoint[];
}
export type ChartSeries = ChartSerie[];

export interface ChartInfo {
  id: string;
  toolbar: {
    show: boolean;
  };
  colors: ChartColors;
}
