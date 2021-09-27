import Build from '../../../entities/Build';
import IUserRepository from '../../../repositories/IUserRepository';
import BOT_PREFIX from '../../../shared/consts/botPrefix';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    userId: string;
    name: string;
    data: Partial<Build>;
}

type Response = Either<string, Build>;

export default class EditBuildUseCase implements UseCase<Request, Response> {
    constructor(private userRepo: IUserRepository) {}

    public async execute(request: Request): Promise<Response> {
        const user = await this.userRepo.get(request.userId);

        if (!user) {
            return left('usuário não encontrado');
        }

        if (!user.builds) {
            return left('usuário não possui builds');
        }

        const oldBuildIndex = user.builds.findIndex(b => b.name === request.name);

        if (oldBuildIndex === -1) {
            return left(`build não encontrada, use o comando \`${BOT_PREFIX} build create\` para criá-la`);
        }

        if (request.data.name && user.builds[oldBuildIndex].name !== request.data.name) {
            const alreadyRegisteredName = user.builds?.find(b => b.name === request.data.name);

            if (alreadyRegisteredName) {
                return left(`build com o nome *${request.data.name}* já existe`);
            }
        }

        const newBuild = { ...user.builds[oldBuildIndex], ...request.data };

        user.builds[oldBuildIndex] = newBuild;

        await this.userRepo.update(user);

        return right(newBuild);
    }
}
