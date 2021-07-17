import Guild from '../entities/Guild';

export default interface IGuildRepository {
    get(name: string): Promise<Guild | undefined> | (Guild | undefined);
    create(guild: Guild): Promise<Guild> | Guild;
    update(guild: Guild): Promise<Guild> | Guild;
}
