import User from '../../../entities/User';
import FileManager from '../../../shared/infra/FileManager';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    guildId: string;
    userId: string;
}

type Response = Either<string, 'OK'>;

class AddGuildToUserUseCase implements UseCase<Request, Response> {
    public constructor(private fileManager: FileManager) {}

    public async execute({ guildId, userId }: Request): Promise<Response> {
        const rawUser = await this.fileManager.get(`users/${userId}.json`);

        if (!rawUser) {
            return left('usuário não encontrado');
        }

        const user: User = JSON.parse(rawUser.toString());

        const guildAlreadyAdded = user.guilds.find(guild => guild === guildId);

        if (guildAlreadyAdded) {
            return left('usuário já faz parte da guilda');
        }

        user.guilds.push(guildId);
        user.currentGuild = guildId;

        await this.fileManager.update(`users/${userId}.json`, JSON.stringify(user));

        return right('OK');
    }
}

export default AddGuildToUserUseCase;
