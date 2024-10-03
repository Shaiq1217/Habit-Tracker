import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple())
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
      ]
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message);
  }

  error(message: string, meta?: any) {
    this.logger.error(message);
  }

  logging() {
    return (req: Request, res: Response, next: NextFunction) => {
      const { method, url } = req;
      const timestamp = new Date().toISOString();

      this.info(`${method}\t${timestamp}\t${url}\t${JSON.stringify(req.body)}`);
      next();
    };
  }
}

const logService = new Logger();

export default logService;
