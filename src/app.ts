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

// CORS configuration
const allowedOrigins = [config.corsUrl, 'http://127.0.0.1:5173'].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.includes(origin as string) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Standard middlewares
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: false, limit: '50mb' }));

// Routes
routes(app);

// Error Handler
globalErrorHandler(app);

// Connect DB
connectDB();

export default app;
