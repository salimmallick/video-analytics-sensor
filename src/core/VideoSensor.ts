import { VideoMetricsCollector } from '../collectors/VideoMetricsCollector';
import { DataTransport } from '../transport/DataTransport';
import { VideoSensorConfig } from '../types/config';

export class VideoSensor {
  private static instance: VideoSensor;
  private metricsCollector: VideoMetricsCollector;
  private transport: DataTransport;

  private constructor(config: VideoSensorConfig) {
    this.transport = new DataTransport(config.endpoint);
    this.metricsCollector = VideoMetricsCollector.getInstance();
  }

  public static init(config: VideoSensorConfig): VideoSensor {
    if (!VideoSensor.instance) {
      VideoSensor.instance = new VideoSensor(config);
    }
    return VideoSensor.instance;
  }

  public attachToVideo(videoElement: HTMLVideoElement): void {
    this.metricsCollector.initialize(videoElement);
    this.metricsCollector.startCollecting((metrics) => {
      this.transport.send({
        type: 'video_metrics',
        payload: metrics,
        timestamp: Date.now()
      });
    });
  }

  public detachFromVideo(): void {
    this.metricsCollector.stopCollecting();
  }

  public track(event: string, data: any = {}): void {
    this.transport.send({
      type: event,
      payload: data,
      timestamp: Date.now()
    });
  }
}