import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import DeleteBuildUseCase from './deleteBuildUseCase';

const userRepo = new S3UserRepository();

const deleteBuildUseCase = new DeleteBuildUseCase(userRepo);

export default deleteBuildUseCase;
