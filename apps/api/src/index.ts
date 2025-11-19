import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ApiResponse, ApiError } from '@shared/types/api';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
import analysisRoutes from './routes/analysis';
import trendRoutes from './routes/trends';
import userRoutes from './routes/user';
import historyRoutes from './routes/history';

app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: { status: 'healthy' },
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
});

app.use('/api/analyze', analysisRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', historyRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  const error: ApiError = { code: 'NOT_FOUND', message: 'Endpoint not found' };
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const error: ApiError = {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(500).json(response);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;