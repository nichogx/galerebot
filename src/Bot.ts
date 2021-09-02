import { Client, CommandInteraction, Intents } from 'discord.js';
import { Command } from './Command';
import { REST } from '@discordjs/rest';
import { LoggerSingleton } from './LoggerSingleton';

import Ping from './commands/Ping';

import InteractionCreate from './events/InteractionCreate';
import { Routes } from 'discord-api-types/v9';

const commands = [Ping];
const events = [InteractionCreate];

export default class Bot {
	public client: Client;
	private logger = LoggerSingleton.get();
	private commandHandlers: Map<string, Command>;
	private rest: REST;

	constructor(private token: string) {
		this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
		this.rest = new REST({ version: '9' }).setToken(this.token);

		this.commandHandlers = new Map();
	}

	public async initialize(): Promise<void> {
		this.logger.info(`Connecting...`);

		await this.initializeEvents();

		try {
			await this.client.login(this.token);
		} catch (error) {
			this.logger.error(`Error logging in.`);

			throw error;
		}

		await this.initializeCommands();
	}

	public async initializeCommands(): Promise<void> {
		const commandList: any[] = [];
		for (const Command of commands) {
			const command = new Command(this);

			for (const name of command.names) {
				this.commandHandlers.set(name, command);
				commandList.push({ name: name, description: command.description });
			}
		}

		this.logger.info(`Refreshing application commands.`);
		for (const guild of await this.client.guilds.fetch()) {
			const guildId = guild[0];
			this.logger.verbose(`Refreshing guild ${guildId}: ${guild[1].name}.`);

			await this.rest.put(Routes.applicationGuildCommands(this.client.user.id, guildId), { body: commandList });
		}
		this.logger.info(`Done refreshing application commands.`);
	}

	public async initializeEvents(): Promise<void> {
		for (const EventHandler of events) {
			const eventHandler = new EventHandler(this);
			this.client.on(eventHandler.eventName, (arg) => {
				eventHandler.handle(arg);
			});
		}
	}

	public async runCommand(interaction: CommandInteraction, cmd: string, args: string[]): Promise<void> {
		const command: Command = this.commandHandlers.get(cmd);
		command.run(interaction, args);
	}
}
