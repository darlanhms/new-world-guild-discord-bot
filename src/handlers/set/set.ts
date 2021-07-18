import { Message } from 'discord.js';
import IUserRepository from '../../repositories/IUserRepository';
import { REMEMBER_CASE, USER_NOT_CREATED_YET } from '../../shared/consts/defaultMessages';
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
            return message.reply(`você precisa informar o nome da guilda ${REMEMBER_CASE}`);
        }

        if (!user) {
            return message.reply(USER_NOT_CREATED_YET);
        }

        if (!user.guilds.length) {
            return message.reply('você ainda não faz parte de nenhuma guilda');
        }

        if (!user.guilds.find(guild => guild === guildName)) {
            return message.reply(
                `\nVocê digitou o nome de uma guilda na qual você não faz parte ${REMEMBER_CASE}`,
            );
        }

        user.currentGuild = guildName;

        await this.userRepo.update(user);

        return message.reply(`agora a sua guilda ativa é a ${guildName}`);
    }
}
