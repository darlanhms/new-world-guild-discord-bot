import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left, right } from '../../../shared/logic/Either';

interface Request {
    userId: string;
    guildName: string;
}

type Response = Either<string, 'OK'>;

export default class RemoveUserFromGuildUseCase {
    constructor(private userRepo: IUserRepository, private guildRepo: IGuildRepository) {}

    async execute({ guildName, userId }: Request): Promise<Response> {
        const user = await this.userRepo.get(userId);

        if (!user) {
            return left('usuário não encontrado');
        }

        if (!user.guilds.includes(guildName)) {
            return left('usuário não está na guild');
        }

        const guild = await this.guildRepo.get(guildName);

        if (!guild) {
            return left('guild não encontrada');
        }

        guild.members = guild.members.filter(m => m.id !== userId);

        user.guilds = user.guilds.filter(userGuild => userGuild !== guildName);
        user.currentGuild = undefined;

        await this.userRepo.update(user);

        await this.guildRepo.update(guild);

        return right('OK');
    }
}
