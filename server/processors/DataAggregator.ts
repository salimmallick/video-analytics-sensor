import { Redis } from 'ioredis';

export class DataAggregator {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async aggregate(data: any) {
    const { type, timestamp } = data;
    const date = new Date(timestamp).toISOString().split('T')[0];

    switch (type) {
      case 'performance':
        await this.aggregatePerformance(data, date);
        break;
      case 'behavior':
        await this.aggregateBehavior(data, date);
        break;
      case 'error':
        await this.aggregateErrors(data, date);
        break;
    }

    return await this.getAggregatedMetrics(date);
  }

  private async aggregatePerformance(data: any, date: string) {
    const key = `aggregated:performance:${date}`;
    await this.redis.hincrby(key, 'total_requests', 1);
    await this.redis.hincrbyfloat(key, 'avg_cpu', data.payload.cpu);
    await this.redis.hincrbyfloat(key, 'avg_memory', data.payload.memory);
  }

  private async aggregateBehavior(data: any, date: string) {
    const key = `aggregated:behavior:${date}`;
    await this.redis.hincrby(key, 'total_sessions', 1);
    await this.redis.hincrby(key, 'total_interactions', data.payload.interactions?.length || 0);
  }

  private async aggregateErrors(data: any, date: string) {
    const key = `aggregated:errors:${date}`;
    await this.redis.hincrby(key, 'total_errors', 1);
    await this.redis.hincrby(key, `error_type:${data.payload.type}`, 1);
  }

  private async getAggregatedMetrics(date: string) {
    const [performance, behavior, errors] = await Promise.all([
      this.redis.hgetall(`aggregated:performance:${date}`),
      this.redis.hgetall(`aggregated:behavior:${date}`),
      this.redis.hgetall(`aggregated:errors:${date}`)
    ]);

    return {
      performance: {
        avg_cpu: parseFloat(performance.avg_cpu) / parseInt(performance.total_requests),
        avg_memory: parseFloat(performance.avg_memory) / parseInt(performance.total_requests),
        total_requests: parseInt(performance.total_requests)
      },
      behavior: {
        total_sessions: parseInt(behavior.total_sessions),
        total_interactions: parseInt(behavior.total_interactions),
        avg_interactions_per_session: parseInt(behavior.total_interactions) / parseInt(behavior.total_sessions)
      },
      errors: {
        total: parseInt(errors.total_errors),
        by_type: Object.entries(errors)
          .filter(([key]) => key.startsWith('error_type:'))
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key.replace('error_type:', '')]: parseInt(value)
          }), {})
      }
    };
  }
}