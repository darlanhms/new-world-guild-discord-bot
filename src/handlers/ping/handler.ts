import { Message } from 'discord.js';
import Handler from '../../shared/logic/Handler';

export default class PingHandler implements Handler {
    public name = 'ping';

    public handle(message: Message): void {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
}
