import { BatteryManager } from '../types/performance';
import { PerformanceMetrics } from '../types/performance';

export class MobilePerformanceCollector {
  private static instance: MobilePerformanceCollector;
  private metricsInterval: number = 5000; // 5 seconds
  private intervalId?: number;

  private constructor() {}

  static getInstance(): MobilePerformanceCollector {
    if (!MobilePerformanceCollector.instance) {
      MobilePerformanceCollector.instance = new MobilePerformanceCollector();
    }
    return MobilePerformanceCollector.instance;
  }

  async collectMetrics(): Promise<Partial<PerformanceMetrics>> {
    const metrics: Partial<PerformanceMetrics> = {
      network: await this.getNetworkInfo(),
      battery: await this.getBatteryInfo(),
      memory: await this.getMemoryUsage(),
      fps: this.getCurrentFPS(),
      appState: await this.getAppState(),
    };

    if (this.isPlatform('ios')) {
      // iOS specific metrics
      metrics.thermals = await this.getIOSThermalState();
    } else if (this.isPlatform('android')) {
      // Android specific metrics
      metrics.thermals = await this.getAndroidThermalInfo();
    }

    return metrics;
  }

  private async getNetworkInfo() {
    const connection = (navigator as any).connection;
    return {
      connectionType: connection?.type || 'unknown',
      isConnected: navigator.onLine,
      bandwidth: connection?.downlink || 0,
      latency: await this.measureLatency()
    };
  }

  private async getBatteryInfo() {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level * 100,
        isCharging: battery.charging,
        temperature: await this.getBatteryTemperature(),
        voltage: await this.getBatteryVoltage()
      };
    } catch (e) {
      return null;
    }
  }

  private async getMemoryUsage() {
    const memory = (performance as any).memory;
    return memory ? {
      total: memory.jsHeapSizeLimit,
      used: memory.usedJSHeapSize,
      limit: memory.totalJSHeapSize
    } : null;
  }

  private getCurrentFPS(): number {
    // Implementation depends on platform-specific APIs
    // This is a simplified version
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();

      const countFrames = () => {
        const currentTime = performance.now();
        frameCount++;

        if (currentTime - lastTime >= 1000) {
          const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
          resolve(fps);
        } else {
          requestAnimationFrame(countFrames);
        }
      };

      requestAnimationFrame(countFrames);
    });
  }

  private async getAppState() {
    return {
      state: document.visibilityState === 'visible' ? 'active' : 'background',
      startupTime: performance.now(),
      frameDrops: await this.getFrameDrops(),
      memoryWarnings: 0 // Platform specific implementation needed
    };
  }

  private isPlatform(platform: 'ios' | 'android'): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    switch (platform) {
      case 'ios':
        return /iphone|ipad|ipod/.test(userAgent);
      case 'android':
        return /android/.test(userAgent);
      default:
        return false;
    }
  }

  startCollecting(callback: (metrics: Partial<PerformanceMetrics>) => void) {
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