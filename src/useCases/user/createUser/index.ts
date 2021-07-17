import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import CreateUserUseCase from './createUserUseCase';

const createUser = new CreateUserUseCase(new S3UserRepository());

export default createUser;
