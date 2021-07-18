import { Message } from 'discord.js';
import Guild from '../../../entities/Guild';
import IGuildRepository from '../../../repositories/IGuildRepository';
import MembersRole from '../../../shared/consts/membersRole';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import GetUserWithGuildUseCase from '../../../useCases/user/getUserWithGuild/getUserWithGuildUseCase';

export default class RemoveGuildModHandler extends BaseHandler implements Handler {
    name = 'remove';

    constructor(private getUserWithGuild: GetUserWithGuildUseCase, private guildRepo: IGuildRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const userOrError = await this.getUserWithGuild.execute(message.author.id);

        if (userOrError.isLeft()) {
            return message.reply(
                `parece que não conseguimos remover o mod, motivo: ${userOrError.value.message}`,
            );
        }

        const user = userOrError.value;
        const guild = user.guild as Guild;

        const isUserOwner = user.guild?.members.find(
            member => member.id === message.author.id && member.role === MembersRole.OWNER,
        );

        if (!isUserOwner) {
            return message.reply('você precisa ser o dono da guilda para remover os moderadores');
        }

        if (!message.mentions.users.size) {
            return message.reply('você precisa marcar os usuários para remover o cargo de moderador');
        }

        const addedMods: string[] = [];

        message.mentions.users.forEach(userMessage => {
            const guildMember = guild.members.find(member => member.id === userMessage.id);

            if (guildMember && guildMember.role === MembersRole.MODERATOR) {
                guildMember.role = MembersRole.MEMBER;

                addedMods.push(`<@${userMessage.id}>`);
            }
        });

        if (!addedMods.length) {
            return message.reply('os membros definidos ou não fazem parte da guilda ou já não são moderadores');
        }

        await this.guildRepo.update(guild);

        if (addedMods.length === 1) {
            return message.channel.send(`${addedMods.join(' ')} foi rebaixado a membro`);
        }

        return message.channel.send(`${addedMods.join(' ')} foram rebaixados a membro`);
    }
}
