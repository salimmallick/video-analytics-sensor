import { Redis } from 'ioredis';

export class MetricsProcessor {
  constructor() {
    this.redis = new Redis();
  }

  async processMetrics(data) {
    const { type, payload, timestamp } = data;

    switch (type) {
      case 'performance':
        await this.processPerformanceMetrics(payload, timestamp);
        break;
      case 'behavior':
        await this.processUserBehavior(payload, timestamp);
        break;
      case 'error':
        await this.processError(payload, timestamp);
        break;
    }
  }

  async processPerformanceMetrics(metrics, timestamp) {
    const key = `metrics:performance:${new Date(timestamp).toISOString().split('T')[0]}`;
    await this.redis.hset(key, timestamp.toString(), JSON.stringify(metrics));
  }

  async processUserBehavior(behavior, timestamp) {
    const key = `metrics:behavior:${behavior.sessionId}`;
    await this.redis.xadd(key, '*', 'data', JSON.stringify(behavior));
  }

  async processError(error, timestamp) {
    const key = 'metrics:errors';
    await this.redis.zadd(key, timestamp, JSON.stringify(error));
  }
}