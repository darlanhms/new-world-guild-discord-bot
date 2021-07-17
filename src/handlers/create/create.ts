import { Message } from 'discord.js';
import Guild from '../../entities/Guild';
import GuildMember from '../../entities/GuildMember';
import User from '../../entities/User';
import MembersRole from '../../shared/consts/membersRole';
import FileManager from '../../shared/infra/FileManager';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';
import AddGuildToUserUseCase from '../../useCases/user/addGuildToUser/addGuildToUserUseCase';
import CreateUserErrors from '../../useCases/user/createUser/createUserErrors';
import CreateUserUseCase from '../../useCases/user/createUser/createUserUseCase';

export default class CreateGuildHandler extends BaseHandler implements Handler {
    constructor(
        private fileManager: FileManager,
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

        message.reply(`Criando a guilda ${guildName}... o dono será ${message.author.username}`);

        // guild object
        const guildMembers = [new GuildMember(message.author.id, MembersRole.OWNER)];
        const guild = new Guild(guildName, guildMembers);

        // save guild object
        await this.fileManager.create(`guilds/${guildName}/infos.json`, JSON.stringify(guild));

        // adding guild to user
        const user = new User(message.author.id, guild.id as string, [guild.id as string]);

        const userCreated = await this.createUser.execute(user);

        if (userCreated.isLeft() && userCreated.value instanceof CreateUserErrors.AlreadyCreated) {
            await this.addGuildToUser.execute({ guildId: guild.id as string, userId: user.id });
        }

        message.reply(`Guilda criada com sucesso! :grin:`);
    }

    private async nameWasTaken(name: string): Promise<boolean> {
        const alreadyExistingFile = await this.fileManager.get(`guilds/${name}/infos.json`);

        return !!alreadyExistingFile;
    }
}