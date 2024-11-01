# Video Analytics Sensor

A lightweight, AI-powered video analytics sensor for OTT applications.

## Features

- Real-time video metrics collection
- Performance monitoring
- Quality of Experience (QoE) tracking
- Viewer engagement analytics
- Automatic error tracking
- Network and CDN performance monitoring

## Installation

```bash
npm install @salimmallick/video-analytics-sensor
```

## Usage

```typescript
import { VideoSensor } from '@salimmallick/video-analytics-sensor';

// Initialize the sensor
const sensor = VideoSensor.init({
  endpoint: 'your-analytics-endpoint',
  appId: 'your-app-id'
});

// React Hook usage
import { useVideoSensor } from '@salimmallick/video-analytics-sensor';

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackEvent } = useVideoSensor(videoRef);

  return <video ref={videoRef} src="your-video-source.mp4" />;
}
```

## Metrics Collected

### Playback QoE
- Buffer ratio
- Startup time
- Error rate
- Resolution quality

### Streaming Quality
- Bitrate
- CDN latency
- Throughput
- Quality switches

### Viewer Engagement
- Watch time
- Completion rate
- Drop-off points
- Interaction events

## Configuration Options

```typescript
interface VideoSensorConfig {
  endpoint: string;
  appId: string;
  appVersion?: string;
  options?: {
    batchSize?: number;
    retryStrategy?: 'linear' | 'exponential';
    samplingRate?: number;
    enabledMetrics?: string[];
  };
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details