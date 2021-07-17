import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    guildName: string;
    userId: string;
}

type Response = Either<string, 'OK'>;

class AddGuildToUserUseCase implements UseCase<Request, Response> {
    public constructor(private userRepo: IUserRepository) {}

    public async execute({ guildName, userId }: Request): Promise<Response> {
        const user = await this.userRepo.get(`users/${userId}.json`);

        if (!user) {
            return left('usuário não encontrado');
        }

        const guildAlreadyAdded = user.guilds.find(guild => guild === guildName);

        if (guildAlreadyAdded) {
            return left('usuário já faz parte da guilda');
        }

        user.guilds.push(guildName);
        user.currentGuild = guildName;

        await this.userRepo.update(user);

        return right('OK');
    }
}

export default AddGuildToUserUseCase;
