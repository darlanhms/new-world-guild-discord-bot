import s3FileManager from '../../../infra/S3FileManager';
import CreateUserUseCase from './createUserUseCase';

const createUser = new CreateUserUseCase(s3FileManager);

export default createUser;
