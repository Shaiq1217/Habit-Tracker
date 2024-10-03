import express, { Application, Request, Response } from 'express';
import logService from './infrastructure/logger.js';
import routes from './routes/routes.js';
import 'express-async-errors'
import connectDB from './infrastructure/connectDB.js';
import cors from 'cors';
import { HOST, PORT } from './common/secrets.js';
const app : Application = express();

app.use(cors());

const port = parseInt(PORT|| '3000', 10);
const host =  HOST || 'localhost'; 

connectDB();

app.use(express.json());
app.use(logService.logging());
app.use(routes);

app.listen(port, host, () => {
  logService.info(`Server running on http://${host}:${port}`);
});
