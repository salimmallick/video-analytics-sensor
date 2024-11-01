import { useEffect, useRef } from 'react';
import { VideoSensor } from '../VideoSensor';

export function useVideoSensor(videoRef: React.RefObject<HTMLVideoElement>) {
  const sensorRef = useRef<VideoSensor>();

  useEffect(() => {
    if (videoRef.current && sensorRef.current) {
      sensorRef.current.attachToVideo(videoRef.current);

      return () => {
        sensorRef.current?.detachFromVideo();
      };
    }
  }, [videoRef.current]);

  return {
    trackEvent: (event: string, data?: any) => {
      sensorRef.current?.track(event, data);
    }
  };
}