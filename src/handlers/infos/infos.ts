import { Message } from 'discord.js';
import client from '../../client';
import IGuildRepository from '../../repositories/IGuildRepository';
import IUserRepository from '../../repositories/IUserRepository';
import MembersRole from '../../shared/consts/membersRole';
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

        if (!user.currentGuild) {
            return message.reply(`você não tem uma guilda ativa no momento`);
        }

        const guild = await this.guildRepo.get(user.currentGuild);

        if (!guild) {
            return message.reply('Que situação... não conseguimos achar as infos da sua guilda');
        }

        const admins = guild.members.filter(m => m.role === MembersRole.MODERATOR);
        const owner = guild.members.find(m => m.role === MembersRole.OWNER);

        const adminsUsers = await Promise.all(admins.map(async m => client.users.fetch(m.id)));
        const ownerUser = await client.users.fetch(owner?.id as string);

        const adminsStr = adminsUsers.map(admin => `${admin.username}`).join('\n');

        let guildFinalStr = `**Nome**: ${guild.name}\n`;

        guildFinalStr += `**Criador**: ${ownerUser.username}\n\n`;

        if (admins.length) {
            guildFinalStr += `**Admins**\n${adminsStr}\n\n`;
        }

        guildFinalStr += `Quantidade total de membros: ${guild.members.length}`;

        return message.channel.send(guildFinalStr);
    }
}
