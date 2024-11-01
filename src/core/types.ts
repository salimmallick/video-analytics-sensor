export type RetryStrategy = 'linear' | 'exponential';

export interface TransportConfig {
  endpoint: string;
  batchSize?: number;
  retryStrategy?: RetryStrategy;
}

export interface SensorData {
  timestamp: number;
  type: string;
  payload: any;
}