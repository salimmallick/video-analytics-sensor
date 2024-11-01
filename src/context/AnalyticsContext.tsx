import React, { createContext, useContext, useEffect, useState } from 'react';
import { SensorCore } from '../core/SensorCore';
import { TransportConfig } from '../core/types';
import { useWebSocket } from '../hooks/useWebSocket';
import { PerformanceMetrics } from '../core/types/performance';
import { VideoMetrics } from '../core/types/video';

const WS_ENDPOINT = import.meta.env.VITE_WS_ENDPOINT || 'wss://api.analytics.example.com/v1/ws';

const defaultConfig: TransportConfig = {
  endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.analytics.example.com/v1/collect',
  batchSize: 100,
  retryStrategy: 'exponential'
};

interface AnalyticsContextType {
  track: (eventName: string, data: any) => void;
  performanceData: PerformanceMetrics | null;
  videoData: VideoMetrics | null;
  activeSection: string;
  activeSubSection: string;
  setActiveSection: (section: string) => void;
  setActiveSubSection: (subsection: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: TransportConfig;
}

export function AnalyticsProvider({ children, config = defaultConfig }: AnalyticsProviderProps) {
  const { data: wsData } = useWebSocket<PerformanceMetrics | VideoMetrics>(WS_ENDPOINT);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [videoData, setVideoData] = useState<VideoMetrics | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');

  useEffect(() => {
    const sensor = SensorCore.getInstance(config);
    sensor.initialize();
  }, []);

  useEffect(() => {
    if (wsData) {
      if ('cpu' in wsData) {
        setPerformanceData(wsData as PerformanceMetrics);
      } else if ('playbackQuality' in wsData) {
        setVideoData(wsData as VideoMetrics);
      }
    }
  }, [wsData]);

  const track = (eventName: string, data: any) => {
    const sensor = SensorCore.getInstance(config);
    sensor.track({
      type: eventName,
      payload: data,
      timestamp: Date.now()
    });
  };

  return (
    <AnalyticsContext.Provider value={{ 
      track, 
      performanceData,
      videoData,
      activeSection,
      activeSubSection,
      setActiveSection,
      setActiveSubSection
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}