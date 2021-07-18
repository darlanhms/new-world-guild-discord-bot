import S3GuildRepository from '../../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import GetUserWithGuildUseCase from './getUserWithGuildUseCase';

const userRepo = new S3UserRepository();
const guildRepo = new S3GuildRepository();

const getUserWithGuild = new GetUserWithGuildUseCase(userRepo, guildRepo);

export default getUserWithGuild;
