import express, { json, urlencoded } from 'express';
import { connectDB } from './configs/db.config';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './configs/config';
import { routes } from './routes';
import Logger from 'bunyan';
import { globalErrorHandler } from './helper/global-error-handler';
import { connectRedis } from './configs/redis.config';

const app = express();

app.set('subdomain offset', 1);

// Security middlewares
app.use(helmet());
app.use(cors({ origin: config.corsUrl, optionsSuccessStatus: 200 }));

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
