export interface VideoSensorConfig {
  endpoint: string;
  appId: string;
  appVersion?: string;
  options?: {
    batchSize?: number;
    retryStrategy?: 'linear' | 'exponential';
    samplingRate?: number;
    enabledMetrics?: string[];
  };
}