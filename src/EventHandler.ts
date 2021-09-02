import Bot from './Bot';

export abstract class EventHandler {
	public abstract eventName: string;

	constructor(protected bot: Bot) {}

	/**
	 * A function that handles the event.
	 *
	 * @param args the arguments to the event
	 */
	protected abstract handle(arg: any): Promise<void>;
}
