export interface VideoMetrics {
  playbackQuality: PlaybackQuality;
  streamingMetrics: StreamingMetrics;
  viewerEngagement: ViewerEngagement;
}

export interface PlaybackQuality {
  bufferingRatio: number;
  startupTime: number;
  failureRate: number;
  averageResolution: string;
  framesPerSecond: number;
  droppedFrames: number;
  bitrate: number;
}

export interface StreamingMetrics {
  cdnLatency: number;
  throughput: number;
  segmentDownloadTime: number;
  qualitySwitches: number;
  bandwidthUtilization: number;
  errorCount: number;
}

export interface ViewerEngagement {
  watchTime: number;
  completionRate: number;
  replayRate: number;
  averageViewDuration: number;
  peakConcurrentViewers: number;
  exitPoints: { [timestamp: string]: number };
}