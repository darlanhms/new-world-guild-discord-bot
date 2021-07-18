import { Message } from 'discord.js';
import IUserRepository from '../../repositories/IUserRepository';
import { USER_NOT_CREATED_YET } from '../../shared/consts/defaultMessages';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';

export default class ListGuildsHandler extends BaseHandler implements Handler {
    name = 'list';

    constructor(private userRepo: IUserRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const user = await this.userRepo.get(message.author.id);

        if (!user) {
            return message.reply(USER_NOT_CREATED_YET);
        }

        if (!user.guilds.length) {
            return message.reply('você não faz parte de nenhuma guilda atualmente');
        }

        const guildsList = user.guilds.map(guild => `- ${guild}`).join('\n');

        return message.reply(`\nVocê faz parte dessas guildas atualmente: \n\n${guildsList}`);
    }
}
