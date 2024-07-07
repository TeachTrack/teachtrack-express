import express, { NextFunction, json, urlencoded } from 'express';
import { connectDB } from './configs/db.config';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './configs/config';
import { routes } from './routes';
import Logger from 'bunyan';
import { globalErrorHandler } from './helper/global-error-handler';

const app = express();

const log: Logger = Logger.createLogger({ name: 'app' });

// Security middlewares
app.use(helmet());
app.use(cors({ origin: config.corsUrl, optionsSuccessStatus: 200 }));

// Standart middlewares
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: false, limit: '50mb' }));

// Routes
routes(app);

// Error Handler
globalErrorHandler(app);

// Connect DB
connectDB();

export default app;
