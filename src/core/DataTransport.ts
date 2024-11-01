import { RetryStrategy } from './types';

export class DataTransport {
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second
  private readonly maxDelay = 5000;  // 5 seconds
  private queue: any[] = [];
  private isSending = false;

  constructor(
    private readonly endpoint: string,
    private readonly batchSize: number = 100,
    private readonly retryStrategy: RetryStrategy = 'exponential'
  ) {}

  async send(data: any): Promise<void> {
    this.queue.push(data);
    
    if (this.queue.length >= this.batchSize && !this.isSending) {
      await this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0 || this.isSending) return;

    this.isSending = true;
    const batch = this.queue.splice(0, this.batchSize);

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batch),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.isSending = false;
        return;
      } catch (error) {
        const delay = this.calculateDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));

        if (attempt === this.maxRetries - 1) {
          // On final retry, add back to queue
          this.queue.unshift(...batch);
          console.error('Failed to send data after all retries', error);
        }
      }
    }

    this.isSending = false;
  }

  private calculateDelay(attempt: number): number {
    if (this.retryStrategy === 'linear') {
      return Math.min(this.baseDelay * (attempt + 1), this.maxDelay);
    }

    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, this.maxDelay);
  }

  // Call this method before app shutdown or page unload
  async flushAll(): Promise<void> {
    while (this.queue.length > 0) {
      await this.flush();
    }
  }
}