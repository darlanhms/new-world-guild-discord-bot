import S3GuildRepository from '../../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import DenyGuildInviteUseCase from './denyGuildInviteUseCase';

const userRepo = new S3UserRepository();
const guildRepo = new S3GuildRepository();

const denyGuildInviteUseCase = new DenyGuildInviteUseCase(userRepo, guildRepo);

export default denyGuildInviteUseCase;
