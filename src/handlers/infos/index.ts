import S3GuildRepository from '../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import GuildInfosHandler from './infos';

const guildRepo = new S3GuildRepository();
const userRepo = new S3UserRepository();

const guildInfosHandler = new GuildInfosHandler(guildRepo, userRepo);

export default guildInfosHandler;
