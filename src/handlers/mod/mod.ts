import S3GuildRepository from '../../repositories/implementations/S3/s3GuildRepository';
import BaseHandler from '../../shared/logic/BaseHandler';
import Handler from '../../shared/logic/Handler';
import getUserWithGuild from '../../useCases/user/getUserWithGuild';
import AddGuildModHandler from './subcommands/add';
import RemoveGuildModHandler from './subcommands/remove';

const guildRepo = new S3GuildRepository();

const addGuildModHandler = new AddGuildModHandler(getUserWithGuild, guildRepo);
const removeGuildModHandler = new RemoveGuildModHandler(getUserWithGuild, guildRepo);

export default class ModGuildHandler extends BaseHandler implements Handler {
    name = 'mod';

    subcommands = [addGuildModHandler, removeGuildModHandler];
}
