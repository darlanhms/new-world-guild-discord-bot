import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import SetGuildHandler from './set';

const userRepo = new S3UserRepository();

const setGuildHandler = new SetGuildHandler(userRepo);

export default setGuildHandler;
