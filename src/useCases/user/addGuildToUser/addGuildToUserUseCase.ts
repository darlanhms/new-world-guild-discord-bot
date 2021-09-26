import GuildMember from '../../../entities/GuildMember';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import MembersRole from '../../../shared/consts/membersRole';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    guildName: string;
    userId: string;
}

type Response = Either<string, 'OK'>;

class AddGuildToUserUseCase implements UseCase<Request, Response> {
    public constructor(private userRepo: IUserRepository, private guildRepo: IGuildRepository) {}

    public async execute({ guildName, userId }: Request): Promise<Response> {
        const user = await this.userRepo.get(userId);
        const guild = await this.guildRepo.get(guildName);

        if (!user) {
            return left('usuário não encontrado');
        }

        if (!guild) {
            return left('guilda não encontrada');
        }

        const guildAlreadyAdded = user.guilds.find(userGuild => userGuild === guildName);

        if (guildAlreadyAdded) {
            return left('usuário já faz parte da guilda');
        }

        guild.invites = guild.invites?.filter(invite => invite !== userId);
        guild.members.push(
            new GuildMember({
                id: userId,
                role: MembersRole.MEMBER,
            }),
        );

        user.guilds.push(guildName);
        user.currentGuild = guildName;

        await this.userRepo.update(user);
        await this.guildRepo.update(guild);

        return right('OK');
    }
}

export default AddGuildToUserUseCase;
