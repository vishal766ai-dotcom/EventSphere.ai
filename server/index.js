import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Security and Performance Middlewares
import { securityHeaders, sanitizeInputs } from './middleware/security.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { cacheControl } from './middleware/caching.js';
import { auditLogger } from './middleware/auditLog.js';
import { errorHandler } from './middleware/errorHandler.js';

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

// Security Headers (OWASP compliant)
app.use(securityHeaders);

// Security & Performance Audit Logging
app.use(auditLogger);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key', 'x-forwarded-for']
}));

// Efficient and Secure Body Parsers (5MB max to prevent memory exhaustion)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Input sanitization against XSS/injections
app.use(sanitizeInputs);

// General API Rate Limiting (120 req/min)
const generalLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120 });
app.use('/api', generalLimiter);

// Stricter Rate Limiting for GenAI Endpoints (40 req/min)
const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: { error: 'GenAI rate limit exceeded. Please wait a moment before sending another prompt.' }
});
app.use('/api/gemini', aiLimiter);
app.use('/api/guest-bot', aiLimiter);

// Health check endpoint for Google Cloud Run / Load Balancer
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'EventSphere AI Event Management Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes with Caching for static catalogs
app.use('/api/gemini', geminiRouter);
app.use('/api/vendors', cacheControl(120), vendorsRouter);
app.use('/api/packages', cacheControl(120), packagesRouter);
app.use('/api/reverse-budget', reverseBudgetRouter);
app.use('/api/express', expressSetupRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/control-room', controlRoomRouter);
app.use('/api/crowd-pool', crowdPoolRouter);
app.use('/api/guest-bot', guestBotRouter);
app.use('/api/decor-visualizer', decorVisualizerRouter);
app.use('/api/sops', cacheControl(120), sopsRouter);
app.use('/api/gifting', cacheControl(120), giftingRouter);
app.use('/api/entertainment', cacheControl(120), entertainmentRouter);
app.use('/api/offers', cacheControl(120), offersRouter);
app.use('/api/timeline', cacheControl(120), timelineRouter);

// Centralized API Error Handler
app.use('/api', errorHandler);

// Serve static frontend files if built with immutable caching
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true
}));

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
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>EventSphere AI Server</title>
        </head>
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
