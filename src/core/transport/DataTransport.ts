import { Observable, Subject, timer } from 'rxjs';
import { buffer, filter, map } from 'rxjs/operators';
import { RetryStrategy } from '../types/config';

export class DataTransport {
  private static instance: DataTransport;
  private dataQueue: Subject<unknown> = new Subject();
  private retryStrategy: RetryStrategy = {
    maxAttempts: 3,
    backoffMs: 1000,
    maxBackoffMs: 30000
  };

  private constructor(private endpoint: string, private batchSize: number = 100) {
    this.initializeTransport();
  }

  public static getInstance(endpoint: string, batchSize?: number): DataTransport {
    if (!DataTransport.instance) {
      DataTransport.instance = new DataTransport(endpoint, batchSize);
    }
    return DataTransport.instance;
  }

  private initializeTransport(): void {
    this.dataQueue.pipe(
      buffer(timer(0, 5000)),
      filter(batch => batch.length > 0),
      map(batch => this.compressData(batch))
    ).subscribe(async compressedBatch => {
      await this.sendWithRetry(compressedBatch);
    });
  }

  private async sendWithRetry(data: unknown, attempt: number = 1): Promise<void> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Batch-Size': data instanceof Array ? data.length.toString() : '1'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (attempt < this.retryStrategy.maxAttempts) {
        const backoff = Math.min(
          this.retryStrategy.backoffMs * Math.pow(2, attempt - 1),
          this.retryStrategy.maxBackoffMs
        );
        
        await new Promise(resolve => setTimeout(resolve, backoff));
        await this.sendWithRetry(data, attempt + 1);
      } else {
        this.handleFailedTransmission(data, error);
      }
    }
  }

  private compressData(data: unknown[]): unknown {
    // Implement compression logic here
    // For now, just return the data as is
    return data;
  }

  private handleFailedTransmission(data: unknown, error: unknown): void {
    // Implement failed transmission handling
    console.error('Failed to send data after all retries', error);
    // Could store failed transmissions in IndexedDB for later retry
  }

  public send(data: unknown): void {
    this.dataQueue.next(data);
  }

  public getQueueObservable(): Observable<unknown> {
    return this.dataQueue.asObservable();
  }
}