import S3GuildRepository from '../../../repositories/implementations/S3/s3GuildRepository';
import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import AddGuildToUserUseCase from './addGuildToUserUseCase';

const addGuildToUserUseCase = new AddGuildToUserUseCase(new S3UserRepository(), new S3GuildRepository());

export default addGuildToUserUseCase;
