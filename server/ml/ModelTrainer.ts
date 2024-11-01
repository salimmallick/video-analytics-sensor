import * as tf from '@tensorflow/tfjs-node';
import { Redis } from 'ioredis';

export class ModelTrainer {
  private redis: Redis;
  private model: tf.LayersModel | null = null;

  constructor() {
    this.redis = new Redis();
    this.initializeModel();
  }

  private async initializeModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async trainModel() {
    const data = await this.fetchTrainingData();
    const { xs, ys } = this.preprocessData(data);

    await this.model?.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
        }
      }
    });

    await this.saveModel();
  }

  private async fetchTrainingData() {
    // Fetch last 24 hours of performance data
    const now = Date.now();
    const data = await this.redis.xrange(
      'analytics_stream',
      now - 24 * 60 * 60 * 1000,
      now
    );
    return data.map(([, [, json]]) => JSON.parse(json));
  }

  private preprocessData(data: any[]) {
    const xs = data.map(d => [
      d.cpu,
      d.memory,
      d.latency,
      d.errorRate,
      d.requestRate
    ]);

    const ys = data.map(d => d.isAnomaly ? 1 : 0);

    return {
      xs: tf.tensor2d(xs),
      ys: tf.tensor2d(ys, [ys.length, 1])
    };
  }

  private async saveModel() {
    const modelPath = 'file://./models/anomaly_detection';
    await this.model?.save(modelPath);
    await this.redis.set('model:last_updated', Date.now());
  }
}