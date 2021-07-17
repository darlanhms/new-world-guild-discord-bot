import { Message } from 'discord.js';

interface HandlerFunction {
    (message: Message): void;
}

export default interface Handler {
    name: string;
    subcommands?: Array<Handler> | Handler;
    handle?: HandlerFunction;
}
