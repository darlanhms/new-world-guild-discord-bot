import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import ListGuildsHandler from './list';

const userRepo = new S3UserRepository();

const listGuildsHandler = new ListGuildsHandler(userRepo);

export default listGuildsHandler;
