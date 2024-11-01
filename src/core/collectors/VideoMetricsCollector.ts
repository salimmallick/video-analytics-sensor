import { VideoMetrics, PlaybackQuality, StreamingMetrics } from '../types/video';

export class VideoMetricsCollector {
  private static instance: VideoMetricsCollector;
  private videoElement: HTMLVideoElement | null = null;
  private metricsInterval: number = 5000; // 5 seconds
  private intervalId?: number;
  private startTime: number = 0;
  private bufferingStartTime: number = 0;
  private totalBufferingTime: number = 0;
  private qualitySwitches: number = 0;
  private errors: number = 0;
  private lastBitrate: number = 0;
  private segmentDownloadTimes: number[] = [];

  private constructor() {}

  static getInstance(): VideoMetricsCollector {
    if (!VideoMetricsCollector.instance) {
      VideoMetricsCollector.instance = new VideoMetricsCollector();
    }
    return VideoMetricsCollector.instance;
  }

  initialize(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.startTime = Date.now();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('waiting', () => {
      this.bufferingStartTime = Date.now();
      this.onBuffering();
    });

    this.videoElement.addEventListener('playing', () => {
      if (this.bufferingStartTime > 0) {
        this.totalBufferingTime += Date.now() - this.bufferingStartTime;
        this.bufferingStartTime = 0;
      }
      this.onPlaying();
    });

    this.videoElement.addEventListener('error', () => {
      this.errors++;
      this.onError();
    });

    // Track quality changes through video track changes
    if (this.videoElement.videoTracks) {
      this.videoElement.videoTracks.addEventListener('change', () => {
        this.qualitySwitches++;
        this.onQualityChange();
      });
    }

    // Monitor bandwidth through video bandwidth estimation
    if ('connection' in navigator && 'downlink' in (navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', () => {
        this.lastBitrate = (navigator as any).connection.downlink * 1000000; // Convert to bps
      });
    }
  }

  async collectMetrics(): Promise<Partial<VideoMetrics>> {
    if (!this.videoElement) {
      throw new Error('Video element not initialized');
    }

    return {
      playbackQuality: await this.getPlaybackQuality(),
      streamingMetrics: await this.getStreamingMetrics(),
      viewerEngagement: this.getViewerEngagement(),
    };
  }

  private async getPlaybackQuality(): Promise<PlaybackQuality> {
    const video = this.videoElement!;
    
    return {
      bufferingRatio: this.calculateBufferingRatio(),
      startupTime: this.getStartupTime(),
      failureRate: this.getFailureRate(),
      averageResolution: `${video.videoWidth}x${video.videoHeight}`,
      framesPerSecond: await this.getFrameRate(),
      droppedFrames: await this.getDroppedFrames(),
      bitrate: this.getCurrentBitrate()
    };
  }

  private async getStreamingMetrics(): Promise<StreamingMetrics> {
    return {
      cdnLatency: await this.measureCDNLatency(),
      throughput: this.calculateThroughput(),
      segmentDownloadTime: this.getAverageSegmentDownloadTime(),
      qualitySwitches: this.qualitySwitches,
      bandwidthUtilization: this.getBandwidthUtilization(),
      errorCount: this.errors
    };
  }

  private calculateBufferingRatio(): number {
    const totalTime = Date.now() - this.startTime;
    return (this.totalBufferingTime / totalTime) * 100;
  }

  private getStartupTime(): number {
    const video = this.videoElement!;
    return video.getStartDate ? video.getStartDate().getTime() - this.startTime : 0;
  }

  private getFailureRate(): number {
    const totalAttempts = this.errors + this.qualitySwitches;
    return totalAttempts > 0 ? (this.errors / totalAttempts) * 100 : 0;
  }

  private async getFrameRate(): Promise<number> {
    if ('getVideoPlaybackQuality' in this.videoElement!) {
      const quality = (this.videoElement as any).getVideoPlaybackQuality();
      const totalFrames = quality.totalVideoFrames;
      const time = this.videoElement!.currentTime;
      return time > 0 ? totalFrames / time : 0;
    }
    return 0;
  }

  private async getDroppedFrames(): Promise<number> {
    if ('getVideoPlaybackQuality' in this.videoElement!) {
      const quality = (this.videoElement as any).getVideoPlaybackQuality();
      return quality.droppedVideoFrames;
    }
    return 0;
  }

  private getCurrentBitrate(): number {
    return this.lastBitrate;
  }

  private async measureCDNLatency(): Promise<number> {
    try {
      const start = performance.now();
      const response = await fetch(this.videoElement!.currentSrc, { method: 'HEAD' });
      return performance.now() - start;
    } catch {
      return 0;
    }
  }

  private calculateThroughput(): number {
    if ('connection' in navigator && 'downlink' in (navigator as any).connection) {
      return (navigator as any).connection.downlink * 1000000; // Convert to bps
    }
    return 0;
  }

  private getAverageSegmentDownloadTime(): number {
    return this.segmentDownloadTimes.length > 0
      ? this.segmentDownloadTimes.reduce((a, b) => a + b, 0) / this.segmentDownloadTimes.length
      : 0;
  }

  private getBandwidthUtilization(): number {
    const availableBandwidth = this.calculateThroughput();
    return availableBandwidth > 0 ? (this.lastBitrate / availableBandwidth) * 100 : 0;
  }

  private getViewerEngagement() {
    const video = this.videoElement!;
    return {
      watchTime: video.currentTime,
      completionRate: (video.currentTime / video.duration) * 100,
      replayRate: 0, // Needs session tracking
      averageViewDuration: video.currentTime,
      peakConcurrentViewers: 0, // Needs server-side data
      exitPoints: this.getExitPoints()
    };
  }

  private getExitPoints(): { [timestamp: string]: number } {
    const video = this.videoElement!;
    const points: { [timestamp: string]: number } = {};
    const currentTime = Math.floor(video.currentTime);
    points[currentTime.toString()] = 1;
    return points;
  }

  startCollecting(callback: (metrics: Partial<VideoMetrics>) => void) {
    this.intervalId = window.setInterval(async () => {
      const metrics = await this.collectMetrics();
      callback(metrics);
    }, this.metricsInterval);
  }

  stopCollecting() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}