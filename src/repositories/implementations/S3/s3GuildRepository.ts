import Guild from '../../../entities/Guild';
import s3FileManager from '../../../infra/S3FileManager';
import IGuildRepository from '../../IGuildRepository';

export default class S3GuildRepository implements IGuildRepository {
    private s3Folder = 'guilds';

    private getS3URL(guildName: string) {
        return `${this.s3Folder}/${guildName}.json`;
    }

    async get(name: string): Promise<Guild | undefined> {
        const guild = await s3FileManager.get(this.getS3URL(name));

        if (!guild) {
            return undefined;
        }

        return JSON.parse(guild.toString());
    }

    async create(guild: Guild): Promise<Guild> {
        await s3FileManager.create(this.getS3URL(guild.name), JSON.stringify(guild));

        return guild;
    }

    async update(guild: Guild): Promise<Guild> {
        await s3FileManager.update(this.getS3URL(guild.name), JSON.stringify(guild));

        return guild;
    }
}
