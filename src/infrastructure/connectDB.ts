import mongoose from 'mongoose';
import logService from './logger.js';
import { MONGO_URI } from '../common/secrets.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI!);
    logService.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logService.error(`Error: ${error}`);
    process.exit(1);
  }
};


export default connectDB;
