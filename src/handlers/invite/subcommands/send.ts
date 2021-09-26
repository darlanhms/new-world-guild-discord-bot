import { Message } from 'discord.js';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import BOT_PREFIX from '../../../shared/consts/botPrefix';
import MembersRole from '../../../shared/consts/membersRole';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import AcceptGuildInviteUseCase from '../../../useCases/invites/acceptGuildInvite/acceptGuildInviteUseCase';
import DenyGuildInviteUseCase from '../../../useCases/invites/denyGuildInvite/denyGuildInviteUseCase';

export default class SendInviteHandler extends BaseHandler implements Handler {
    name = 'send';

    constructor(
        private guildRepo: IGuildRepository,
        private userRepo: IUserRepository,
        private acceptGuildInvite: AcceptGuildInviteUseCase,
        private denyGuildInvite: DenyGuildInviteUseCase,
    ) {
        super();
    }

    async handle(message: Message): Promise<void> {
        const userIdsToInvite: string[] = [];
        const alreadyAddedMembers: string[] = [];

        const userMessage = await this.userRepo.get(message.author.id);

        if (!userMessage) {
            message.reply('Ai doidão, você precisa existir primeiro antes de convidar alguém pra uma guilda');
            return;
        }

        if (!userMessage.currentGuild) {
            message.reply('você não está com uma guilda ativa atualmente');
            return;
        }

        const guild = await this.guildRepo.get(userMessage.currentGuild);

        if (!guild) {
            message.reply('Ai doidão, você precisa estar numa guilda primeiro antes de convidar alguém.');
            return;
        }

        const userMember = guild.members.find(member => member.id === message.author.id);

        if (!userMember || ![MembersRole.MODERATOR, MembersRole.OWNER].includes(userMember.role)) {
            message.reply('Que mancada, você não é nem ADM nem dono da guilda, não da de convidar assim né');
            return;
        }

        message.mentions.users.forEach(async user => {
            if (
                guild.members.find(member => member.id === user.id) ||
                guild.invites?.find(invite => invite === user.id)
            ) {
                alreadyAddedMembers.push(user.id);
            } else {
                if (!guild.invites) {
                    guild.invites = [user.id];
                } else {
                    guild.invites.push(user.id);
                }

                userIdsToInvite.push(user.id);
            }
        });

        await this.guildRepo.update(guild);

        const alreadyInvitedTags = alreadyAddedMembers.map(member => `<@${member}>`).join(', ');

        if (alreadyAddedMembers.length) {
            if (alreadyAddedMembers.length === 1) {
                message.reply(
                    `Fica ligado ai, o guerreiro ${alreadyInvitedTags} ja faz parte da guilda ou já foi convidado`,
                );
            } else {
                message.reply(
                    `Fica ligado ai, os guerreiros ${alreadyInvitedTags} ja fazem parte da guilda ou já foram convidados`,
                );
            }
        }

        for (const userId of userIdsToInvite) {
            this.handleSendInviteToUser(userId, message, guild.name);
        }
    }

    private async handleSendInviteToUser(
        userToInviteId: string,
        message: Message,
        guildName: string,
    ): Promise<Message> {
        const toAwaitInviteMessage = await message.channel.send(
            `<@${userToInviteId}>, você foi convidado para a guilda \`${guildName}\`! \n Basta usar o comando \`${BOT_PREFIX} invite (accept|deny) <nome da guilda>\` ou \n Você pode reagir para aceitar ou recusar`,
        );

        toAwaitInviteMessage.react('✅');
        toAwaitInviteMessage.react('❌');

        const reactionResponseMap = await toAwaitInviteMessage.awaitReactions({
            filter: (reaction, user) =>
                user.id === userToInviteId && ['✅', '❌'].includes(reaction.emoji.name || ''),
            max: 1,
        });

        const reactionResponse = reactionResponseMap.first();

        const reactionEmoji = reactionResponse?.emoji.name;

        if (reactionEmoji === '✅') {
            const acceptResponse = await this.acceptGuildInvite.execute({ guildName, userId: userToInviteId });

            if (acceptResponse.isLeft()) {
                return toAwaitInviteMessage.reply(acceptResponse.value);
            }

            return toAwaitInviteMessage.reply(`Convite aceito!, seja bem-vindo a guilda ${guildName}!`);
        }

        if (reactionEmoji === '❌') {
            const denyResponse = await this.denyGuildInvite.execute({ guildName, userId: userToInviteId });

            if (denyResponse.isLeft()) {
                return toAwaitInviteMessage.reply(denyResponse.value);
            }

            return toAwaitInviteMessage.reply(`Convite recusado, uma pena :smiling_face_with_tear:`);
        }

        return toAwaitInviteMessage;
    }
}
