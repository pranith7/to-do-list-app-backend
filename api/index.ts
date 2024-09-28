import serverless from 'serverless-http';
import { app } from '../src/app';
import ConnectDB from '../src/db/index';

// Initialize database connection
ConnectDB();

export const handler = serverless(app);