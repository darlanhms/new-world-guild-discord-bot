import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';

interface Request {
    userId: string;
    buildName: string;
}

type Response = Either<string, 'OK'>;

export default class DeleteBuildUseCase implements UseCase<Request, Response> {
    constructor(private userRepository: IUserRepository) {}

    public async execute({ userId, buildName }: Request): Promise<Response> {
        const user = await this.userRepository.get(userId);

        if (!user) {
            return left('você precisar entrar em uma guild ou criar uma build antes!');
        }

        if (!user.builds) {
            return left('você não possui nenhuma build atualmente');
        }

        const buildRegistered = user.builds?.find(build => build.name === buildName);

        if (!buildRegistered) {
            return left(`você não tem uma build chamada ${buildName}`);
        }

        user.builds = user.builds.filter(build => build.name !== buildName);

        await this.userRepository.update(user);

        return right('OK');
    }
}
