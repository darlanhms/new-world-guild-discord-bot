import { Message } from 'discord.js';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import MembersRole from '../../../shared/consts/membersRole';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';

export default class SendInviteHandler extends BaseHandler implements Handler {
    name = 'send';

    constructor(private guildRepo: IGuildRepository, private userRepo: IUserRepository) {
        super();
    }

    async handle(message: Message): Promise<void> {
        const usernamesInvited: string[] = [];
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

        message.mentions.users.forEach(user => {
            if (
                guild.members.find(member => member.id === user.id) ||
                guild.invites?.find(invite => invite === user.id)
            ) {
                alreadyAddedMembers.push(`<@${user.id}>`);
            } else {
                if (!guild.invites) {
                    guild.invites = [user.id];
                } else {
                    guild.invites.push(user.id);
                }

                usernamesInvited.push(`<@${user.id}>`);
            }
        });

        await this.guildRepo.update(guild);

        if (alreadyAddedMembers.length) {
            if (alreadyAddedMembers.length === 1) {
                message.channel.send(
                    `Fica ligado ai, o guerreiro ${alreadyAddedMembers.join(
                        ' ',
                    )} ja faz parte da guilda ou já foi convidado`,
                );
            } else {
                message.channel.send(
                    `Fica ligado ai, os guerreiros ${alreadyAddedMembers.join(
                        ' ',
                    )} ja fazem parte da guilda ou já foram convidados`,
                );
            }
        }

        if (usernamesInvited.length) {
            if (usernamesInvited.length === 1) {
                message.channel.send(
                    `O guerreiro ${usernamesInvited.join(' ')} foi convidado para a guilda ${guild.name}!`,
                );
            } else {
                message.channel.send(
                    `Os guerreiros ${usernamesInvited.join(' ')} foram convidados para a guilda ${guild.name}!`,
                );
            }
        }
    }
}
