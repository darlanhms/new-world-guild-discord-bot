import User from '../../../entities/User';
import s3FileManager from '../../../infra/S3FileManager';
import IUserRepository from '../../IUserRepository';

export default class S3UserRepository implements IUserRepository {
    private s3Folder = 'users';

    private getS3URL(userId: string) {
        return `${this.s3Folder}/${userId}.json`;
    }

    async get(userId: string): Promise<User | undefined> {
        const user = await s3FileManager.get(this.getS3URL(userId));

        if (!user) {
            return undefined;
        }

        return JSON.parse(user.toString());
    }

    async create(user: User): Promise<User> {
        await s3FileManager.create(this.getS3URL(user.id), JSON.stringify(user));

        return user;
    }

    async update(user: User): Promise<User> {
        await s3FileManager.update(this.getS3URL(user.id), JSON.stringify(user));

        return user;
    }
}
