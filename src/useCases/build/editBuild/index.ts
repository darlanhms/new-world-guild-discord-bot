import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import EditBuildUseCase from './editBuildUseCase';

const userRepo = new S3UserRepository();

const editBuildUsecase = new EditBuildUseCase(userRepo);

export default editBuildUsecase;
