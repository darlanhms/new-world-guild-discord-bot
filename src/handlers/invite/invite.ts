import S3GuildRepository from '../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import Handler from '../../shared/logic/Handler';
import getUserWithGuild from '../../useCases/user/getUserWithGuild';
import isUserAdmin from '../../useCases/user/isUserAdmin';

import AcceptInviteHandler from './subcommands/accept';
import DenyInviteHandler from './subcommands/deny';
import RemoveInviteHandler from './subcommands/remove';
import SendInviteHandler from './subcommands/send';

const userRepo = new S3UserRepository();
const guildRepo = new S3GuildRepository();

const sendInviteHandler = new SendInviteHandler(guildRepo, userRepo);
const acceptInviteHander = new AcceptInviteHandler(userRepo, guildRepo);
const removeInviteHandler = new RemoveInviteHandler(getUserWithGuild, isUserAdmin, guildRepo);
const denyInviteHandler = new DenyInviteHandler(userRepo, guildRepo);

export default class InviteHandler implements Handler {
    name = 'invite';

    subcommands = [sendInviteHandler, acceptInviteHander, removeInviteHandler, denyInviteHandler];
}
