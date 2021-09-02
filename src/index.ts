import { Logger } from 'winston';
import { LoggerSingleton } from './LoggerSingleton';
import GalereBot from './Bot';

// configures logger
const logger: Logger = LoggerSingleton.get();
logger.info(`Iniciando bot`);

// gets token
const token = process.env.TOKEN;
if (!token) {
	logger.error(`Token não encontrado`);
	process.exit(1);
}

const bot = new GalereBot(token);
bot.initialize();
