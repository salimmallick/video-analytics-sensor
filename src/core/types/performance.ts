export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  network: NetworkMetrics;
  fps: number;
  battery?: BatteryMetrics;
  storage?: StorageMetrics;
  thermals?: ThermalMetrics;
  appState?: AppStateMetrics;
}

export interface NetworkMetrics {
  latency: number;
  bandwidth: number;
  connectionType: string;
  isConnected: boolean;
}

export interface BatteryMetrics {
  level: number;
  isCharging: boolean;
  temperature: number;
  voltage: number;
}

export interface StorageMetrics {
  totalSpace: number;
  freeSpace: number;
  appSize: number;
  cacheSize: number;
}

export interface ThermalMetrics {
  cpuTemperature: number;
  thermalState: 'normal' | 'fair' | 'serious' | 'critical';
}

export interface AppStateMetrics {
  state: 'active' | 'background' | 'inactive';
  memoryWarnings: number;
  lastCrashTimestamp?: number;
  startupTime: number;
  frameDrops: number;
}