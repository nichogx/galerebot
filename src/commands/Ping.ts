import { CommandInteraction } from 'discord.js';
import Bot from '../Bot';
import { Command } from '../Command';

export default class Ping extends Command {
	public names: string[] = ['ping', 'test', 'p'];

	constructor(bot: Bot) {
		super(bot);
	}

	protected validateArgs(args: string[]): boolean {
		return true;
	}

	protected async actions(interaction: CommandInteraction, args: string[]): Promise<void> {
		interaction.reply(`Pong :)`);
	}
}
