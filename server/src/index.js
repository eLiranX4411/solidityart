import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import logger from './config/logger.js';
import scanRouter from './routes/scan.js';

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// CORS before helmet
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(helmet());
app.use(express.json({ limit: '200kb' }));

// Routes
app.use('/api/scan', scanRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  if (!MONGODB_URI) {
    logger.error('MONGODB_URI is not set');
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.error('ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  logger.info('Connected to MongoDB');

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  logger.error('Startup error:', err.message);
  process.exit(1);
});
