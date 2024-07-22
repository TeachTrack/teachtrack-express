import express, { json, urlencoded } from 'express';
import { connectDB } from './configs/db.config';
import helmet from 'helmet';
import cors from 'cors';
import { routes } from './routes';
import { globalErrorHandler } from './helper/global-error-handler';
import { connectRedis } from './configs/redis.config';

const app = express();
// CORS configuration
app.use(cors({ origin: '*' }));

// Subdomain configuration
app.set('subdomain offset', 1);

// Security middlewares
app.use(helmet());

// Standard middlewares
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: false, limit: '50mb' }));

// Routes
routes(app);

// Error Handler
globalErrorHandler(app);

// Connect DB
connectDB();
connectRedis();

export default app;
