import winston, { Logger } from 'winston';

export class LoggerSingleton {
	private static logger: Logger;

	public static get(): Logger {
		if (!this.logger) {
			this.logger = winston.createLogger({
				format: winston.format.combine(
					winston.format.timestamp({
						format: 'YYYY-MM-DD HH:mm:ss',
					}),
					winston.format.errors({ stack: true }),
					winston.format.colorize(),
					winston.format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`)
				),
				transports: [
					new winston.transports.Console({ level: 'debug' }),
					new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
					new winston.transports.File({ filename: './logs/combined.log', level: 'verbose' }),
				],
				exceptionHandlers: [
					new winston.transports.Console(),
					new winston.transports.File({ filename: 'logs/exceptions.log' }),
				],
				exitOnError: false,
			});

			// make winston log unhandled rejections
			process.on('unhandledRejection', (reason, promise) => {
				this.logger.error('unhandled promise rejection. Check exceptions.log');
				if (reason) throw reason;
				else throw { message: promise };
			});
		}

		return this.logger;
	}
}
