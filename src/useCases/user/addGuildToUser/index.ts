import s3FileManager from '../../../infra/S3FileManager';
import AddGuildToUserUseCase from './addGuildToUserUseCase';

const addGuildToUserUseCase = new AddGuildToUserUseCase(s3FileManager);

export default addGuildToUserUseCase;
