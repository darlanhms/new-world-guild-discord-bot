import { Message } from 'discord.js';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import DenyGuildInviteUseCase from '../../../useCases/invites/denyGuildInvite/denyGuildInviteUseCase';

export default class DenyInviteHandler extends BaseHandler implements Handler {
    name = 'deny';

    constructor(private denyGuildInvite: DenyGuildInviteUseCase) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const guildName = this.getCommandPayload(message, 'invite');

        const response = await this.denyGuildInvite.execute({
            guildName,
            userId: message.author.id,
        });

        if (response.isLeft()) {
            return message.reply(response.value);
        }

        return message.channel.send(
            `O guerreiro <@${message.author.id}> recusou o convite da guilda ${guildName}`,
        );
    }
}
