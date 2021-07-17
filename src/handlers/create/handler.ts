import { Message } from 'discord.js';
import Handler from '../../shared/logic/Handler';

export default class CreateGuildHandler implements Handler {
    public name = 'create';

    public handle(message: Message): void {
        console.log(message.guild);
        const guildName = message.content.replace('>guild create', '').trim();

        console.log(guildName);

        if (!guildName) {
            message.reply('Ei amigão, você não escolheu um belo nome para a sua guilda');
        }

        message.reply(`Criando a guilda ${guildName}... o dono será ${message.author.username}`);
    }
}
