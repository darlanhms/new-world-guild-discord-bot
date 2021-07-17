import User from '../../../entities/User';
import IUserRepository from '../../../repositories/IUserRepository';
import { Either, left, right } from '../../../shared/logic/Either';
import UseCase from '../../../shared/logic/UseCase';
import CreateUserErrors from './createUserErrors';

type Response = Either<CreateUserErrors.AlreadyCreated, User>;

export default class CreateUserUseCase implements UseCase<User, Response> {
    public constructor(private userRepo: IUserRepository) {}

    public async execute(user: User): Promise<Response> {
        const userExists = await this.userRepo.get(user.id);

        if (userExists) {
            return left(new CreateUserErrors.AlreadyCreated());
        }

        await this.userRepo.create(user);

        return right(user);
    }
}
