import S3GuildRepository from '../../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import addGuildToUserUseCase from '../../user/addGuildToUser';
import AcceptGuildInviteUseCase from './acceptGuildInviteUseCase';

const userRepo = new S3UserRepository();
const guildRepo = new S3GuildRepository();

const acceptGuildInviteUseCase = new AcceptGuildInviteUseCase(guildRepo, userRepo, addGuildToUserUseCase);

export default acceptGuildInviteUseCase;
