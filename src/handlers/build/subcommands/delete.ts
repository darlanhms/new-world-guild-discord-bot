import { Message } from 'discord.js';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import DeleteBuildUseCase from '../../../useCases/build/deleteBuild/deleteBuildUseCase';

export default class DeleteBuildHandler extends BaseHandler implements Handler {
    name = 'delete';

    constructor(private deleteBuild: DeleteBuildUseCase) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const payload = this.getCommandPayload(message, 'build');

        if (!payload) {
            return message.reply(':warning: Você precisa dizer qual build que você quer deletar né');
        }

        const confirmationMessage = await message.reply(
            `Tem certeza que vai remover a build ***${payload}*** pra sempre? Isso signifca uma boa quantidade de tempo :sweat_smile:`,
        );

        confirmationMessage.react('✅');
        confirmationMessage.react('❌');

        const reaction = await confirmationMessage.awaitReactions({
            filter: (reacted, user) =>
                user.id === message.author.id && ['✅', '❌'].includes(reacted.emoji.name || ''),
            max: 1,
        });

        await confirmationMessage.reactions.removeAll();

        const reactionEmoji = reaction.first()?.emoji.name;

        if (reactionEmoji === '✅') {
            const deletedBuild = await this.deleteBuild.execute({
                buildName: payload,
                userId: message.author.id,
            });

            if (deletedBuild.isLeft()) {
                return confirmationMessage.edit(
                    `:warning: Tivemos um pequeno problema ao remover a build: ${deletedBuild.value}`,
                );
            }

            return confirmationMessage.edit(`Build ***${payload}*** removida com sucesso!`);
        }

        if (reactionEmoji === '❌') {
            return confirmationMessage.edit('Fechou! essa build vai continuar no lugarzinho dela :grin:');
        }

        return confirmationMessage.edit('Aparentemente você escolheu comando inválido, que perigo');
    }
}
