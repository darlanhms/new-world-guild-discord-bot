import { Message } from 'discord.js';
import IUserRepository from '../../repositories/IUserRepository';
import Handler from '../../shared/logic/Handler';
import RemoveUserFromGuildUseCase from '../../useCases/user/removeUserFromGuild/removeUserFromGuild';

export default class QuitHandler implements Handler {
    name = 'quit';

    constructor(private removeUserFromGuild: RemoveUserFromGuildUseCase, private useRepo: IUserRepository) {}

    public async handle(message: Message): Promise<void> {
        const user = await this.useRepo.get(message.author.id);

        if (!user) {
            message.reply('não foi possível sair da guilda, seu usuário não foi encontrado!');
            return;
        }

        if (!user.currentGuild) {
            message.reply('não foi possível sair da guilda, você não está com uma guilda ativa no momento!');
            return;
        }

        // `Você tem certeza que deseja sair da guilda ${user.currentGuild}?\nReaja com :white_check_mark: para SIM ou :x: para NÃO`,

        const sendedMessage = await message.reply(
            `Você tem certeza que deseja sair da guilda ${user.currentGuild}?\n:white_check_mark: para SIM ou :x: para NÃO`,
        );

        sendedMessage.react('✅');
        sendedMessage.react('❌');

        const reactionResponse = await sendedMessage.awaitReactions({
            filter: (reaction, userMessage) =>
                userMessage.id === message.author.id && ['✅', '❌'].includes(reaction.emoji.name || ''),
            max: 1,
        });

        const responseEmoji = reactionResponse.first()?.emoji.name;

        if (responseEmoji === '✅') {
            const result = await this.removeUserFromGuild.execute({
                userId: message.author.id,
                guildName: user.currentGuild,
            });

            if (result.isLeft()) {
                message.reply(`não foi possível sair da guilda, ${result.value}`);
                return;
            }

            message.reply(`Você saiu da guilda ${user.currentGuild} com sucesso!`);
        } else if (responseEmoji === '❌') {
            message.reply(`Você desistiu de sair da guilda, ufa!`);
        } else {
            message.reply('aparentemente você escolheu um comando inválido');
        }
    }
}
