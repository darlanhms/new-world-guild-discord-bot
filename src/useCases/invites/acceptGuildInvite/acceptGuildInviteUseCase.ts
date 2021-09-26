import User from '../../../entities/User';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';
import AddGuildToUserUseCase from '../../user/addGuildToUser/addGuildToUserUseCase';

interface Request {
    userId: string;

    guildName: string;
}

type Response = Either<string, 'OK'>;

export default class AcceptGuildInviteUseCase implements UseCase<Request, Response> {
    constructor(
        private guildRepo: IGuildRepository,
        private userRepo: IUserRepository,
        private addGuildToUser: AddGuildToUserUseCase,
    ) {}

    public async execute({ guildName, userId }: Request): Promise<Response> {
        const guild = await this.guildRepo.get(guildName);

        if (!guild) {
            return left('você ta maluco, essa guild não existe');
        }

        if (!guild.invites?.includes(userId)) {
            return left('garoto ixpertinho, essa guilda não te convidou :sweat_smile:');
        }

        const userAlreadyRegistered = await this.userRepo.get(userId);

        if (!userAlreadyRegistered) {
            await this.userRepo.create(
                new User({
                    id: userId,
                    guilds: [],
                    currentGuild: undefined,
                }),
            );
        }

        const addGuildOrError = await this.addGuildToUser.execute({ guildName: guild.name, userId });

        return addGuildOrError;
    }
}
