import * as tf from '@tensorflow/tfjs';
import { PerformanceMetrics } from '../types/performance';

export class AnomalyDetector {
  private model: tf.LayersModel | null = null;
  private readonly windowSize = 10;
  private readonly threshold = 0.1;
  private metricsHistory: PerformanceMetrics[] = [];

  constructor() {
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      inputShape: [this.windowSize * 4] // 4 metrics per time step
    }));
    
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 4,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    this.model = model;
  }

  public async detectAnomaly(metrics: PerformanceMetrics): Promise<boolean> {
    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > this.windowSize) {
      this.metricsHistory.shift();
    }

    if (this.metricsHistory.length < this.windowSize) {
      return false;
    }

    const input = this.prepareInput(this.metricsHistory);
    const prediction = await this.predict(input);
    const actual = this.normalizeMetrics(metrics);
    
    return this.calculateAnomalyScore(prediction, actual) > this.threshold;
  }

  private prepareInput(history: PerformanceMetrics[]): tf.Tensor2D {
    const flattenedHistory = history.flatMap(metrics => [
      metrics.cpu,
      metrics.memory,
      metrics.network.latency,
      metrics.fps
    ]);
    
    return tf.tensor2d([flattenedHistory], [1, this.windowSize * 4]);
  }

  private async predict(input: tf.Tensor2D): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const prediction = await this.model.predict(input) as tf.Tensor;
    const values = await prediction.data();
    return Array.from(values);
  }

  private normalizeMetrics(metrics: PerformanceMetrics): number[] {
    return [
      metrics.cpu / 100,
      metrics.memory / 1000,
      metrics.network.latency / 1000,
      metrics.fps / 60
    ];
  }

  private calculateAnomalyScore(predicted: number[], actual: number[]): number {
    return predicted.reduce((sum, value, index) => 
      sum + Math.abs(value - actual[index]), 0) / predicted.length;
  }
}