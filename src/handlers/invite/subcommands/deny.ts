import { Message } from 'discord.js';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';

export default class DenyInviteHandler extends BaseHandler implements Handler {
    name = 'deny';

    constructor(private userRepo: IUserRepository, private guildRepo: IGuildRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const user = await this.userRepo.get(message.author.id);
        const guildName = this.getCommandPayload(message, 'invite');

        const guild = await this.guildRepo.get(guildName);

        if (!guild) {
            return message.reply('po, essa guilda não existe não');
        }

        const guildInvite = guild.invites?.find(invite => invite === message.author.id);

        if (!guildInvite) {
            return message.reply('você ta tendo alucinações, essa guilda não te convidou...');
        }

        if (user?.guilds.includes(guildName)) {
            return message.reply('você já faz parte dessa guilda cara.');
        }

        guild.invites = guild.invites?.filter(invite => invite !== message.author.id);

        await this.guildRepo.update(guild);

        return message.channel.send(
            `O guerreiro <@${message.author.id}> recusou o convite da guilda ${guildName}`,
        );
    }
}
