import Handler from '../../shared/logic/Handler';
import CreateBuildHandler from './subcommands/create';

export default class BuildHandler implements Handler {
    name = 'build';

    subcommands = [new CreateBuildHandler()];
}
