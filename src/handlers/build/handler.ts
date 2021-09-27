import Handler from '../../shared/logic/Handler';
import createBuildUseCase from '../../useCases/build/createBuild';
import CreateBuildHandler from './subcommands/create';

export default class BuildHandler implements Handler {
    name = 'build';

    subcommands = [new CreateBuildHandler(createBuildUseCase)];
}
