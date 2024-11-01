import { DataTransport } from './DataTransport';
import { SensorData, TransportConfig } from './types';

export class SensorCore {
  private static instance: SensorCore;
  private transport: DataTransport;
  private isInitialized = false;
  private config: TransportConfig;

  private constructor(config: TransportConfig) {
    if (!config?.endpoint) {
      throw new Error('Analytics endpoint configuration is required');
    }

    this.config = config;
    this.transport = new DataTransport(
      this.config.endpoint,
      this.config.batchSize,
      this.config.retryStrategy
    );

    window.addEventListener('beforeunload', () => {
      this.transport.flushAll();
    });
  }

  static getInstance(config: TransportConfig): SensorCore {
    if (!SensorCore.instance) {
      SensorCore.instance = new SensorCore(config);
    }
    return SensorCore.instance;
  }

  initialize(): void {
    if (this.isInitialized) {
      console.warn('SensorCore is already initialized');
      return;
    }

    this.isInitialized = true;
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });
  }

  async track(data: SensorData): Promise<void> {
    if (!this.isInitialized) {
      console.warn('SensorCore must be initialized before tracking');
      return;
    }

    try {
      await this.transport.send(data);
    } catch (error) {
      console.error('Failed to track data:', error);
    }
  }

  private async trackError(error: any): Promise<void> {
    try {
      await this.transport.send({
        type: 'error',
        payload: error,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to track error:', err);
    }
  }
}