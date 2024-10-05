import express, { Application } from 'express';
import logService from './infrastructure/logger.js';
import routes from './routes/routes.js';
import 'express-async-errors';
import db from './infrastructure/connectDB.js';
import cors from 'cors';
import { HOST, PORT } from './common/secrets.js';

const app: Application = express();

app.use(cors());

const port = parseInt(PORT || '3000', 10);
const host = HOST || 'localhost';

// Establish database connection
db.connectDB();

// Middleware setup
app.use(express.json());
app.use(logService.logging());
app.use(routes);

// Start server
const server = app.listen(port, host, () => {
  logService.info(`Server running on http://${host}:${port}`);
});

// // Graceful shutdown logic
// const gracefulShutdown = (signal: string) => {
//   logService.info(`Received ${signal}. Shutting down gracefully...`);

//   server.close(() => {
//     logService.info('Server closed.');
//     db.closeDBConnection();
//     process.exit(0);
//   });

//   setTimeout(() => {
//     logService.error('Forcefully shutting down.');
//     process.exit(1);
//   }, 10000); 
// };

// // Handle process exit events
// process.on('exit', (code) => {
//   logService.info(`Process exited with code ${code}`);
// });

// // Handle termination signals
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// // Optional: Catch unhandled promise rejections or uncaught exceptions
// process.on('unhandledRejection', (reason, promise) => {
//   logService.error('Unhandled Rejection:', reason);
//   process.exit(1);
// });

// process.on('uncaughtException', (error) => {
//   logService.error('Uncaught Exception:', error);
//   process.exit(1);
// });
