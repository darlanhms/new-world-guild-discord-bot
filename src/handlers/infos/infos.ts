import { Message } from 'discord.js';
import IGuildRepository from '../../repositories/IGuildRepository';
import IUserRepository from '../../repositories/IUserRepository';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';

export default class GuildInfosHandler extends BaseHandler implements Handler {
    name = 'info';

    constructor(private guildRepo: IGuildRepository, private userRepo: IUserRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const user = await this.userRepo.get(message.author.id);

        if (!user) {
            return message.reply(
                'Que situação... não conseguimos achar as infos da sua guilda, motivo: seu usuário não foi encontrado',
            );
        }

        const guild = await this.guildRepo.get(user.currentGuild);

        if (!guild) {
            return message.reply('Que situação... não conseguimos achar as infos da sua guilda');
        }

        return message.channel.send(`Nome: ${guild.name} \nQuantidade de membros: ${guild.members.length}`);
    }
}
