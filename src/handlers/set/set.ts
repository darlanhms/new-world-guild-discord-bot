import { Message } from 'discord.js';
import IUserRepository from '../../repositories/IUserRepository';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';

export default class SetGuildHandler extends BaseHandler implements Handler {
    name = 'set';

    constructor(private userRepo: IUserRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const user = await this.userRepo.get(message.author.id);
        const guildName = this.getCommandPayload(message);

        if (!guildName) {
            message.reply(
                'você precisa informar o nome da guilda \nLembre-se, maiúsculas e minúsculas importam :wink:',
            );
        }

        if (!user) {
            return message.reply(
                'você ainda não faz parte do nosso ecossistema, para fazer isso você precisa participar de alguma guilda ou criar uma build',
            );
        }

        if (!user.guilds.length) {
            return message.reply('você ainda não faz parte de nenhuma guilda');
        }

        if (!user.guilds.find(guild => guild === guildName)) {
            return message.reply(
                '\nVocê digitou o nome de uma guilda na qual você não faz parte \nLembre-se, maiúsculas e minúsculas importam :wink:',
            );
        }

        user.currentGuild = guildName;

        await this.userRepo.update(user);

        return message.reply(`agora a sua guilda ativa é a ${guildName}`);
    }
}
