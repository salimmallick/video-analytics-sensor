export interface DeviceInfo {
  platform: string;
  userAgent: string;
  screenResolution: {
    width: number;
    height: number;
  };
  language: string;
  timezone: string;
}