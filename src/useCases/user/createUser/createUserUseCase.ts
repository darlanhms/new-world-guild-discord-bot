import User from '../../../entities/User';
import FileManager from '../../../shared/infra/FileManager';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';
import CreateUserErrors from './createUserErrors';

type Response = Either<CreateUserErrors.AlreadyCreated, User>;

export default class CreateUserUseCase implements UseCase<User, Response> {
    public constructor(private fileManager: FileManager) {}

    public async execute(user: User): Promise<Response> {
        const userExists = await this.fileManager.get(`users/${user.id}.json`);

        if (userExists) {
            return left(new CreateUserErrors.AlreadyCreated());
        }

        await this.fileManager.create(`users/${user.id}.json`, JSON.stringify(user));

        return right(user);
    }
}
