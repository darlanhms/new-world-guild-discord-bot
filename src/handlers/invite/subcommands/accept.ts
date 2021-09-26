import { Message } from 'discord.js';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import AcceptGuildInviteUseCase from '../../../useCases/invites/acceptGuildInvite/acceptGuildInviteUseCase';

export default class AcceptInviteHandler extends BaseHandler implements Handler {
    name = 'accept';

    constructor(private acceptGuildInvite: AcceptGuildInviteUseCase) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const guildName = this.getCommandPayload(message, 'invite');

        const acceptInviteResponse = await this.acceptGuildInvite.execute({
            guildName,
            userId: message.author.id,
        });

        if (acceptInviteResponse.isLeft()) {
            return message.reply(acceptInviteResponse.value);
        }

        return message.channel.send(
            `O guerreiro <@${message.author.id}> entrou com sucesso na guilda ${guildName}, dêem as boas vindas!`,
        );
    }
}
