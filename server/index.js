import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route handlers
import geminiRouter from './routes/gemini.js';
import vendorsRouter from './routes/vendors.js';
import packagesRouter from './routes/packages.js';
import reverseBudgetRouter from './routes/reverseBudget.js';
import expressSetupRouter from './routes/expressSetup.js';
import escrowRouter from './routes/escrow.js';
import controlRoomRouter from './routes/controlRoom.js';
import crowdPoolRouter from './routes/crowdPool.js';
import guestBotRouter from './routes/guestBot.js';
import decorVisualizerRouter from './routes/decorVisualizer.js';
import sopsRouter from './routes/sops.js';
import giftingRouter from './routes/gifting.js';
import entertainmentRouter from './routes/entertainment.js';
import offersRouter from './routes/offers.js';
import timelineRouter from './routes/timeline.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint for Google Cloud Run / Load Balancer
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'EventSphere AI Event Management Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/gemini', geminiRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/reverse-budget', reverseBudgetRouter);
app.use('/api/express', expressSetupRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/control-room', controlRoomRouter);
app.use('/api/crowd-pool', crowdPoolRouter);
app.use('/api/guest-bot', guestBotRouter);
app.use('/api/decor-visualizer', decorVisualizerRouter);
app.use('/api/sops', sopsRouter);
app.use('/api/gifting', giftingRouter);
app.use('/api/entertainment', entertainmentRouter);
app.use('/api/offers', offersRouter);
app.use('/api/timeline', timelineRouter);

// Serve static frontend files if built
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing fallback to index.html if dist exists
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>EventSphere AI Server</title></head>
        <body style="font-family:sans-serif;padding:40px;background:#0f172a;color:#f8fafc;">
          <h1>🎉 EventSphere API Server is running on port ${PORT}!</h1>
          <p>Frontend is currently running via Vite dev server or being built.</p>
          <p>Health status: <a href="/health" style="color:#38bdf8">/health</a></p>
        </body>
        </html>
      `);
    }
  });
});

let serverInstance = null;

if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EventSphere Server listening on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌐 Local Web App: http://localhost:${PORT}`);
  });
}

export { serverInstance };
export default app;
