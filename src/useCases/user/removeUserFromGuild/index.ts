import S3GuildRepository from '../../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import RemoveUserFromGuildUseCase from './removeUserFromGuild';

const userRepo = new S3UserRepository();

const guildRepo = new S3GuildRepository();

const removeUserFromGuildUseCase = new RemoveUserFromGuildUseCase(userRepo, guildRepo);

export { removeUserFromGuildUseCase };
