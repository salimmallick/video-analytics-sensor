# Analytics Platform API Documentation

## Core SDK

### Installation
```js
npm install @analytics/core
```

### Usage
```js
import { AnalyticsProvider } from '@analytics/core';

function App() {
  return (
    <AnalyticsProvider config={{
      endpoint: 'your-endpoint',
      batchSize: 100
    }}>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

## API Endpoints

### Data Collection
POST /v1/collect
- Accepts analytics events in batch
- Supports automatic retry
- Rate limited to 1000 requests/minute

### WebSocket API
ws://your-domain/v1/ws
- Real-time metrics streaming
- Anomaly notifications
- System status updates