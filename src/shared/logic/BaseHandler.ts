import { Message } from 'discord.js';
import BOT_PREFIX from '../consts/botPrefix';
import Handler from './Handler';

export default abstract class BaseHandler implements Handler {
    public abstract name: string;

    public getCommandPayload(message: Message, parentCommand?: string): string {
        return message.content
            .replace(`${BOT_PREFIX} ${parentCommand ? `${parentCommand} ` : ''}${this.name}`, '')
            .trim();
    }
}
