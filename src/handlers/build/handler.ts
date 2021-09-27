import S3UserRepository from '../../repositories/implementations/S3/s3UserRepository';
import Handler from '../../shared/logic/Handler';
import createBuildUseCase from '../../useCases/build/createBuild';
import editBuildUsecase from '../../useCases/build/editBuild';
import CreateBuildHandler from './subcommands/create';
import EditBuildNameHandler from './subcommands/editName';
import ListBuildsHandler from './subcommands/list';

const userRepo = new S3UserRepository();

export default class BuildHandler implements Handler {
    name = 'build';

    subcommands = [
        new CreateBuildHandler(createBuildUseCase),
        new ListBuildsHandler(userRepo),
        new EditBuildNameHandler(editBuildUsecase),
    ];
}
