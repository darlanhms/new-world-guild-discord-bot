import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    userId: string;

    guildName: string;
}

type Response = Either<string, 'OK'>;

export default class DenyGuildInviteUseCase implements UseCase<Request, Response> {
    constructor(private userRepo: IUserRepository, private guildRepo: IGuildRepository) {}

    public async execute({ guildName, userId }: Request): Promise<Response> {
        const user = await this.userRepo.get(userId);

        const guild = await this.guildRepo.get(guildName);

        if (!guild) {
            return left('po, essa guilda não existe não');
        }

        const guildInvite = guild.invites?.find(invite => invite === userId);

        if (!guildInvite) {
            return left('você ta tendo alucinações, essa guilda não te convidou...');
        }

        if (user?.guilds.includes(guildName)) {
            return left('você já faz parte dessa guilda cara.');
        }

        guild.invites = guild.invites?.filter(invite => invite !== userId);

        await this.guildRepo.update(guild);

        return right('OK');
    }
}
