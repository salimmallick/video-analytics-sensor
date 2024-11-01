export interface UserBehavior {
  sessionId: string;
  interactions: UserInteraction[];
  navigation: NavigationPath[];
  engagement: EngagementMetrics;
}

export interface UserInteraction {
  timestamp: number;
  type: InteractionType;
  target: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface NavigationPath {
  from: string;
  to: string;
  timestamp: number;
  duration: number;
}

export interface EngagementMetrics {
  timeOnPage: number;
  scrollDepth: number;
  interactions: number;
  bounced: boolean;
}

export enum InteractionType {
  CLICK = 'click',
  SCROLL = 'scroll',
  HOVER = 'hover',
  INPUT = 'input',
  CUSTOM = 'custom'
}