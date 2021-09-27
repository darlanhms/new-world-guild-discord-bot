import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';
import IUserRepository from '../../../repositories/IUserRepository';
import Build from '../../../entities/Build';

interface Request extends Omit<Build, 'name'> {
    name?: string;
    userId: string;
}

type Response = Either<string, Build>;

export default class CreateBuildUseCase implements UseCase<Request, Response> {
    constructor(private userRepo: IUserRepository) {}

    public async execute(request: Request): Promise<Response> {
        let user = await this.userRepo.get(request.userId);

        if (!user) {
            user = await this.userRepo.create({
                id: request.userId,
                guilds: [],
                builds: [],
            });
        }

        if (!user.builds) {
            user.builds = [];
        }

        if (!request.name) {
            request.name = this.defaultBuildName();
        }

        const buildWithSameName = user.builds.find(build => build.name === request.name);

        if (buildWithSameName) {
            return left(`já existe uma build com o nome ${buildWithSameName.name}, utilize outro.`);
        }

        const build = new Build({
            name: request.name,
            firstWeapon: request.firstWeapon,
            secondWeapon: request.secondWeapon,
            spec: request.spec,
        });

        user.builds.push(build);

        await this.userRepo.update(user);

        return right(build);
    }

    private defaultBuildName(): string {
        const date = new Date();

        return `build_${
            date.getMonth() + 1
        }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    }
}
