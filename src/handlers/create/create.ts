import { Message } from 'discord.js';
import Guild from '../../entities/Guild';
import GuildMember from '../../entities/GuildMember';
import User from '../../entities/User';
import IGuildRepository from '../../repositories/IGuildRepository';
import MembersRole from '../../shared/consts/membersRole';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';
import AddGuildToUserUseCase from '../../useCases/user/addGuildToUser/addGuildToUserUseCase';
import CreateUserErrors from '../../useCases/user/createUser/createUserErrors';
import CreateUserUseCase from '../../useCases/user/createUser/createUserUseCase';

export default class CreateGuildHandler extends BaseHandler implements Handler {
    constructor(
        private guildRepo: IGuildRepository,
        private createUser: CreateUserUseCase,
        private addGuildToUser: AddGuildToUserUseCase,
    ) {
        super();
    }

    public name = 'create';

    public async handle(message: Message): Promise<void> {
        const guildName = this.getCommandPayload(message);

        if (!guildName) {
            message.reply('Ei amigão, você não escolheu um belo nome para a sua guilda');
        }

        if (await this.nameWasTaken(guildName)) {
            message.reply(`Que triste acontecimento, o nome '${guildName}' já foi escolhido :frowning2:`);
            return;
        }

        message.reply(`Criando a guilda ${guildName}... o dono será <@${message.author.id}>`);

        // guild object
        const guildMembers = [
            new GuildMember({
                id: message.author.id,
                role: MembersRole.OWNER,
            }),
        ];

        const guild = new Guild({
            name: guildName,
            members: guildMembers,
        });

        // save guild object
        await this.guildRepo.create(guild);

        // adding guild to user
        const user = new User({
            id: message.author.id,
            currentGuild: guild.name,
            guilds: [guild.name],
        });

        const userCreated = await this.createUser.execute(user);

        if (userCreated.isLeft() && userCreated.value instanceof CreateUserErrors.AlreadyCreated) {
            const addGuild = await this.addGuildToUser.execute({ guildName: guild.name, userId: user.id });

            if (addGuild.isLeft()) {
                message.reply(`Houve um problema ao atribuir o seu usuário a guilda: ${addGuild.value}`);
                return;
            }
        }

        message.reply(`Guilda criada com sucesso! :grin:`);
    }

    private async nameWasTaken(name: string): Promise<boolean> {
        const alreadyExistingFile = await this.guildRepo.get(name);

        return !!alreadyExistingFile;
    }
}
