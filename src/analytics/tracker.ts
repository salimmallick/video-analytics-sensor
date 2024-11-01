import { SensorCore } from '../core/SensorCore';

export const track = (event: string, data: any = {}) => {
  try {
    SensorCore.getInstance().track({
      type: event,
      payload: {
        ...data,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
  }
};