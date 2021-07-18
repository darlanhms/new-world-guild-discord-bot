import S3GuildRepository from '../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import Handler from '../../shared/logic/Handler';
import AcceptInviteHandler from './subcommands/accept';
import SendInviteHandler from './subcommands/send';

const userRepo = new S3UserRepository();
const guildRepo = new S3GuildRepository();

const sendInviteHandler = new SendInviteHandler(guildRepo, userRepo);
const acceptInviteHander = new AcceptInviteHandler(userRepo, guildRepo);

export default class InviteHandler implements Handler {
    name = 'invite';

    subcommands = [sendInviteHandler, acceptInviteHander];
}
