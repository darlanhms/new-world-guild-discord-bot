import User from '../../../entities/User';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';
import IGuildRepository from '../../../repositories/IGuildRepository';
import IUserRepository from '../../../repositories/IUserRepository';
import GetUserWithGuildErrors from './getUserWithGuildErrors';

type Response = Either<
    | GetUserWithGuildErrors.UserNotExists
    | GetUserWithGuildErrors.UserWithNoGuild
    | GetUserWithGuildErrors.GuildNotExists,
    User
>;

export default class GetUserWithGuildUseCase implements UseCase<string, Response> {
    constructor(private userRepo: IUserRepository, private guildRepo: IGuildRepository) {}

    public async execute(userId: string): Promise<Response> {
        const user = await this.userRepo.get(userId);

        if (!user) {
            return left(new GetUserWithGuildErrors.UserNotExists());
        }

        if (!user.currentGuild) {
            return left(new GetUserWithGuildErrors.UserWithNoGuild());
        }

        const guild = await this.guildRepo.get(user.currentGuild);

        if (!guild) {
            return left(new GetUserWithGuildErrors.GuildNotExists());
        }

        user.guild = guild;

        return right(user);
    }
}
