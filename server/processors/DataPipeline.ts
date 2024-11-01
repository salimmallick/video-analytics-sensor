import { MetricsProcessor } from './MetricsProcessor';
import { AnomalyDetector } from '../ml/AnomalyDetector';
import { DataAggregator } from './DataAggregator';

export class DataPipeline {
  private metricsProcessor: MetricsProcessor;
  private anomalyDetector: AnomalyDetector;
  private aggregator: DataAggregator;

  constructor() {
    this.metricsProcessor = new MetricsProcessor();
    this.anomalyDetector = new AnomalyDetector();
    this.aggregator = new DataAggregator();
  }

  async processData(data: any) {
    // Process raw metrics
    const processedData = await this.metricsProcessor.process(data);
    
    // Check for anomalies
    const anomalies = await this.anomalyDetector.detect(processedData);
    
    // Aggregate results
    const aggregatedData = await this.aggregator.aggregate(processedData);
    
    return {
      processed: processedData,
      anomalies,
      aggregated: aggregatedData
    };
  }
}