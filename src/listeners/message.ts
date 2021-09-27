import { Message } from 'discord.js';
import client from '../client';
import allHandlers from '../handlers';
import BOT_PREFIX from '../shared/consts/botPrefix';
import Handler from '../shared/logic/Handler';

function handleUpcomingMessage(
    allComands: string[],
    commandIndex: number,
    message: Message,
    handlers: Array<Handler> | Handler,
): void {
    const currentCommand = allComands[commandIndex];

    if (Array.isArray(handlers)) {
        const availableHandler = handlers.find(handler => handler.name === currentCommand);

        if (!availableHandler) {
            message.reply(
                `Opa! Você escolheu um comando que não existe "${
                    currentCommand || 'nenhum comando'
                }", os comandos válidos são: ${handlers.map(h => h.name).join(', ')}`,
            );
            return;
        }

        if (availableHandler.subcommands) {
            // if the available handler has subcommnds we should validate if the user typed another command here
            if (!allComands[commandIndex + 1]) {
                const availableCommands = Array.isArray(availableHandler.subcommands)
                    ? availableHandler.subcommands.map(s => s.name).join(', ')
                    : availableHandler.subcommands.name;

                message.reply(
                    `Opa! Você não escolheu o próximo comando a ser executado, os disponíveis são: ${availableCommands}`,
                );
                return;
            }
            handleUpcomingMessage(allComands, commandIndex + 1, message, availableHandler.subcommands);
            return;
        }

        if (!availableHandler.handle) {
            throw new Error('Handler must have a handle or subcommands to work');
        }

        availableHandler.handle(message);
        return;
    }

    if (handlers.name === currentCommand) {
        if (handlers.handle) {
            handlers.handle(message);
            return;
        }

        throw new Error('Handler must have a handle or subcommands to work');
    }

    message.reply(
        `Opa! Você escolheu um comando que não existe (${currentCommand}), os comandos válidos são: ${handlers.name}`,
    );
}

client.on('messageCreate', message => {
    if (message.author.bot) {
        return;
    }

    if (!message.content.startsWith(BOT_PREFIX)) {
        return;
    }

    const commandBody = message.content.slice(BOT_PREFIX.length);
    const args = commandBody.split(' ');

    // remove empty string at array's first position
    args.shift();

    try {
        handleUpcomingMessage(args, 0, message, allHandlers);
    } catch (error: any) {
        console.error(`[HANDLE MESSAGE ERROR]: ${error.message}`);
    }
});
