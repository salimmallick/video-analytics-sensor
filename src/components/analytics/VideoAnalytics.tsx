import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { PlaybackQoE } from './video/PlaybackQoE';
import { VideoOverview } from './video/VideoOverview';
import { StreamingQuality } from './video/StreamingQuality';
import { ViewerEngagement } from './video/ViewerEngagement';
import { ContentAnalytics } from './video/ContentAnalytics';

export function VideoAnalytics() {
  const { activeSubSection } = useAnalytics();

  const renderContent = () => {
    switch (activeSubSection) {
      case 'playback-qoe':
        return <PlaybackQoE />;
      case 'streaming-quality':
        return <StreamingQuality />;
      case 'viewer-engagement':
        return <ViewerEngagement />;
      case 'content-analytics':
        return <ContentAnalytics />;
      case 'overview':
      default:
        return <VideoOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}