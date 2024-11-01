export const analyticsConfig = {
  // Core configuration
  endpoint: 'https://api.analytics.example.com/v1/collect',
  appId: 'your-app-id',
  
  // Optional features (all default to true)
  features: {
    video: true,      // Video analytics
    performance: true, // Performance monitoring
    behavior: true,    // User behavior tracking
    errors: true      // Error tracking
  }
};