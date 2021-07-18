import { Message } from 'discord.js';
import IGuildRepository from '../../../repositories/IGuildRepository';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import GetUserWithGuildUseCase from '../../../useCases/user/getUserWithGuild/getUserWithGuildUseCase';
import IsUserAdminUseCase from '../../../useCases/user/isUserAdmin/isUserAdminUseCase';

export default class RemoveInviteHandler extends BaseHandler implements Handler {
    name = 'remove';

    constructor(
        private getUserWithGuild: GetUserWithGuildUseCase,
        private isUserAdmin: IsUserAdminUseCase,
        private guildRepo: IGuildRepository,
    ) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const userOrError = await this.getUserWithGuild.execute(message.author.id);

        if (userOrError.isLeft()) {
            return message.reply(`Que situação, ${userOrError.value.message}`);
        }

        const user = userOrError.value;

        const isAdmin = this.isUserAdmin.execute(user);

        if (!isAdmin) {
            return message.reply('pera lá, você não é nem mod nem dono da guilda, ta perdido ai doidão?');
        }

        if (!user.guild || !user.guild.invites) {
            return message.reply('não existem convites ativos nessa guilda.');
        }

        const idsToRevoke = message.mentions.users.map(discUser => discUser.id);

        user.guild.invites = user.guild.invites.filter(invite => !idsToRevoke.includes(invite));

        await this.guildRepo.update(user.guild);

        const strInvites = idsToRevoke.map(id => `<@${id}>`).join(' ');

        if (strInvites.length === 1) {
            return message.channel.send(
                `O convite do exonerado ${strInvites} foi removido, só não vão brigar ein`,
            );
        }

        return message.channel.send(
            `Os convites dos exonerados ${strInvites} foram removidos, só não vão brigar ein`,
        );
    }
}
