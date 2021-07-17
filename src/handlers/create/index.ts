import S3GuildRepository from '../../repositories/implementations/S3/s3GuildRepository';
import addGuildToUserUseCase from '../../useCases/user/addGuildToUser';
import createUser from '../../useCases/user/createUser';
import CreateGuildHandler from './create';

const guildRepo = new S3GuildRepository();

const createGuildHandler = new CreateGuildHandler(guildRepo, createUser, addGuildToUserUseCase);

export default createGuildHandler;
