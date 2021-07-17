import s3FileManager from '../../infra/S3FileManager';
import addGuildToUserUseCase from '../../useCases/user/addGuildToUser';
import createUser from '../../useCases/user/createUser';
import CreateGuildHandler from './create';

const createGuildHandler = new CreateGuildHandler(s3FileManager, createUser, addGuildToUserUseCase);

export default createGuildHandler;
