import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import CreateBuildUseCase from './createBuildUseCase';

const usersRepo = new S3UserRepository();

const createBuildUseCase = new CreateBuildUseCase(usersRepo);

export default createBuildUseCase;
