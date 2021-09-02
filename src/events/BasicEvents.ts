import pjson from '../../package.json';

import { EventHandler } from '../EventHandler';
import { LoggerSingleton } from '../LoggerSingleton';

export class ReadyEvent extends EventHandler {
	public eventName: string = 'ready';

	protected async handle(): Promise<void> {
		const logger = LoggerSingleton.get();

		logger.info(`Connected!`);
		logger.info(`Logged in as ${this.bot.client.user.tag}`);

		this.bot.client.user.setActivity(`${pjson.description} v${pjson.version}`);
	}
}

export class WarnEvent extends EventHandler {
	public eventName: string = 'warn';

	protected async handle(info: any): Promise<void> {
		LoggerSingleton.get().warn(info);
	}
}

export class ErrorEvent extends EventHandler {
	public eventName: string = 'error';

	protected async handle(error: Error): Promise<void> {
		const logger = LoggerSingleton.get();

		logger.error(`Error - not handled`);

		if (error.message) {
			logger.error(error.message);
		}
	}
}
