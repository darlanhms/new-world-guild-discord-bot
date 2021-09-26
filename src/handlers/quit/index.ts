import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import { removeUserFromGuildUseCase } from '../../useCases/user/removeUserFromGuild';
import QuitHandler from './handler';

const userRepo = new S3UserRepository();

const quitHandler = new QuitHandler(removeUserFromGuildUseCase, userRepo);

export default quitHandler;
