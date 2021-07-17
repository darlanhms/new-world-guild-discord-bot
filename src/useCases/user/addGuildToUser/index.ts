import S3UserRepository from '../../../repositories/implementations/S3/s3UserRepository';
import AddGuildToUserUseCase from './addGuildToUserUseCase';

const addGuildToUserUseCase = new AddGuildToUserUseCase(new S3UserRepository());

export default addGuildToUserUseCase;
