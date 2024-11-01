export interface SensorConfig {
  samplingRate: number;
  enabledMetrics: string[];
  mlConfig: {
    anomalyDetection: boolean;
    behaviorAnalysis: boolean;
    modelUpdateInterval: number;
  };
  privacySettings: {
    anonymizeIp: boolean;
    collectPii: boolean;
  };
  networkConfig: {
    batchSize: number;
    compressionLevel: number;
    retryStrategy: RetryStrategy;
  };
}

export interface RetryStrategy {
  maxAttempts: number;
  backoffMs: number;
  maxBackoffMs: number;
}