import { Message } from 'discord.js';
import Guild from '../../../entities/Guild';
import IGuildRepository from '../../../repositories/IGuildRepository';
import MembersRole from '../../../shared/consts/membersRole';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import GetUserWithGuildUseCase from '../../../useCases/user/getUserWithGuild/getUserWithGuildUseCase';

export default class AddGuildModHandler extends BaseHandler implements Handler {
    name = 'add';

    constructor(private getUserWithGuild: GetUserWithGuildUseCase, private guildRepo: IGuildRepository) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const userOrError = await this.getUserWithGuild.execute(message.author.id);

        if (userOrError.isLeft()) {
            return message.reply(
                `parece que não conseguimos adicionar o mod, motivo: ${userOrError.value.message}`,
            );
        }

        const user = userOrError.value;
        const guild = user.guild as Guild;

        const isUserOwner = user.guild?.members.find(
            member => member.id === message.author.id && member.role === MembersRole.OWNER,
        );

        if (!isUserOwner) {
            return message.reply('você precisa ser o dono da guilda para adicionar os moderadores');
        }

        if (!message.mentions.users.size) {
            return message.reply(
                'você precisa marcar os usuários que você deseja adicionar como moderadores da guilda',
            );
        }

        const addedMods: string[] = [];

        message.mentions.users.forEach(userMessage => {
            const guildMember = guild.members.find(member => member.id === userMessage.id);

            if (guildMember && guildMember.role === MembersRole.MEMBER) {
                guildMember.role = MembersRole.MODERATOR;

                addedMods.push(`<@${userMessage.id}>`);
            }
        });

        if (!addedMods.length) {
            return message.reply('Os membros definidos ou não fazem parte da guilda ou já são moderadores');
        }

        await this.guildRepo.update(guild);

        if (addedMods.length === 1) {
            return message.channel.send(`O membro ${addedMods.join(' ')} foi promovido a moderador, parabéns!`);
        }

        return message.channel.send(
            `Os membros ${addedMods.join(' ')} foram promovidos a moderadores, parabéns!`,
        );
    }
}
