export interface ApiResponse<T> {
  data: T;
  metadata: {
    err: boolean;
    message: string;
  };
}
