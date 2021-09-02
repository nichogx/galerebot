import { Interaction } from 'discord.js';
import { EventHandler } from '../EventHandler';
import { LoggerSingleton } from '../LoggerSingleton';

export default class InteractionCreate extends EventHandler {
	public eventName: string = 'interactionCreate';
	private logger = LoggerSingleton.get();

	public async handle(interaction: Interaction) {
		this.logger.debug(`Received interaction ${interaction.type}.`);
		if (interaction.isCommand()) {
			this.logger.debug(`Received command ${interaction.commandName} from ${interaction.member}.`);
			await this.bot.runCommand(interaction, interaction.commandName, []);
		}
	}
}
