import { AnalyticsProvider, useAnalytics } from './provider';
import { track } from './tracker';

// Simple tracking helper
const Analytics = {
  track,
  // Video-specific tracking
  video: {
    start: (videoId: string) => track('video_start', { videoId }),
    complete: (videoId: string) => track('video_complete', { videoId }),
    error: (videoId: string, error: string) => track('video_error', { videoId, error }),
    progress: (videoId: string, progress: number) => track('video_progress', { videoId, progress })
  }
};

export { Analytics, AnalyticsProvider, useAnalytics };