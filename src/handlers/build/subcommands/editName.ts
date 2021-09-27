import { Message } from 'discord.js';
import BOT_PREFIX from '../../../shared/consts/botPrefix';
import BaseHandler from '../../../shared/logic/BaseHandler';
import Handler from '../../../shared/logic/Handler';
import EditBuildUseCase from '../../../useCases/build/editBuild/editBuildUseCase';

export default class EditBuildNameHandler extends BaseHandler implements Handler {
    name = 'editName';

    constructor(private editBuild: EditBuildUseCase) {
        super();
    }

    public async handle(message: Message): Promise<Message> {
        const messagePayload = this.getCommandPayload(message, 'build');

        const [oldName, newName, ...anything] = messagePayload.split(', ');

        if (!oldName || !newName) {
            return message.reply(
                `Nome antigo ou novo não encontrados\nExemplo de uso do comando: \`${BOT_PREFIX} build editName nomeAntigo, novoNome\``,
            );
        }

        if (anything.length) {
            return message.reply(`O nome da build não pode conter virgúlas`);
        }

        const response = await this.editBuild.execute({
            name: oldName,
            userId: message.author.id,
            data: {
                name: newName,
            },
        });

        if (response.isLeft()) {
            return message.reply(
                `Que azar, não consegui atualizar o nome da sua build\nMotivo: ${response.value}`,
            );
        }

        return message.reply(`Nome da build atualizado de *${oldName}* para *${newName}* com sucesso!`);
    }
}
