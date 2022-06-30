export interface SnapshotWithoutStatus {
  receivedTime: Date;
  babyboxName: string;
  temperature: SnapshotTemperatures;
  voltage: SnapshotVoltages;
}

export interface Snapshot extends SnapshotWithoutStatus {
  status: number;
}

export interface SnapshotTemperatures {
  outside: number;
  inner: number;
  bottom: number;
  top: number;
  casing: number;
}

export interface SnapshotVoltages {
  in: number;
  battery: number;
}

export interface SnapshotQuery {
  BB: string;
  T0: string;
  T1: string;
  T2: string;
  T3: string;
  T4: string;
  T5: string;
  T6: string;
  T7: string;
}
