import { APIGuildMember } from 'discord-api-types';
import { CommandInteraction, Guild, GuildMember, PermissionString } from 'discord.js';
import Bot from './Bot';

export interface CommandOptions {
	description?: string;
	usage?: string;
	permissions?: PermissionString[];
}

export abstract class Command {
	public abstract names: string[];

	public description: string;
	public usage: string;
	public permissions: PermissionString[];

	constructor(protected bot: Bot, options: CommandOptions = undefined) {
		this.description = options?.description || `no description`;
		this.usage = options?.usage || ``;

		this.permissions = options?.permissions || [];
	}

	/**
	 * Checks if the member has permissions to run this command.
	 *
	 * @param member the member to check
	 * @returns true if the member can run the command, false if not
	 */
	public hasPermission(member: GuildMember): boolean {
		return member.permissions.has(this.permissions);
	}

	/**
	 * Runs the command.
	 *
	 * @param args the arguments specified by the user
	 */
	public async run(interaction: CommandInteraction, args: string[]): Promise<void> {
		const guild: Guild = interaction.guild;
		const member: GuildMember = await guild.members.fetch(interaction.user.id);

		if (!this.hasPermission(member)) {
			interaction.reply(`You do not have permission to run this command.`);
			return;
		}

		if (!this.validateArgs(args)) {
			interaction.reply(`Arguments invalid. Usage: ${this.usage}`);
			return;
		}

		await this.actions(interaction, args);
	}

	/**
	 * A function that validates the arguments given by args.
	 *
	 * @param args
	 * @returns true if arguments are valid, false if not
	 */
	protected abstract validateArgs(args: string[]): boolean;

	/**
	 * A function that runs the actions of that command.
	 *
	 * @param args the arguments to the command
	 */
	protected abstract actions(interaction: CommandInteraction, args: string[]): Promise<void>;
}
