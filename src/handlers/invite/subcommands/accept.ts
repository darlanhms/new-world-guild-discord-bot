import { Message } from 'discord.js';
import GuildMember from '../../../entities/GuildMember';
import User from '../../../entities/User';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import MembersRole from '../../../shared/consts/membersRole';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';

export default class AcceptInviteHandler extends BaseHandler implements Handler {
    name = 'accept';

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

        if (!user) {
            await this.userRepo.create(new User(message.author.id, guildName, [guildName]));
        } else if (user.guilds.includes(guildName)) {
            return message.reply('você já faz parte dessa guilda cara.');
        }

        guild.invites = guild.invites?.filter(invite => invite !== message.author.id);
        guild.members.push(new GuildMember(message.author.id, MembersRole.MEMBER));

        await this.guildRepo.update(guild);

        return message.channel.send(
            `O gurreiro <@${message.author.id}> entrou com sucesso na guilda ${guildName}, dêem as boas vindas!`,
        );
    }
}
