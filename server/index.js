import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import Redis from 'ioredis';
import { z } from 'zod';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const redis = new Redis();

const analyticsSchema = z.object({
  timestamp: z.number(),
  type: z.string(),
  payload: z.any()
});

app.use(express.json());

// Endpoint to receive analytics data
app.post('/v1/collect', async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const event of data) {
      const validatedEvent = analyticsSchema.parse(event);
      
      // Store in Redis
      await redis.xadd(
        'analytics_stream',
        '*',
        'data',
        JSON.stringify(validatedEvent)
      );

      // Broadcast to connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(validatedEvent));
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing analytics:', error);
    res.status(400).json({ error: error.message });
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
});