import User from '../entities/User';

export default interface IUserRepository {
    get(id: string): Promise<User | undefined> | (User | undefined);
    create(user: User): Promise<User> | User;
    update(user: User): Promise<User> | User;
}
