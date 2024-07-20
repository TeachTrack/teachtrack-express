import mongoose from 'mongoose';
import { config } from './config';
import * as bunyan from 'bunyan';

const log = bunyan.createLogger({ name: 'db-config' });

export const connectDB = async () => {
  try {
    const connection = config.dbUrl;
    await mongoose.connect(connection, { connectTimeoutMS: 10000 });
    log.info(`connected to the database: ` + config.dbUrl);
  } catch (err) {
    log.error(`Failed to connect to the database at url: ${config.dbUrl}. Error: ${err}`);
  }
};
