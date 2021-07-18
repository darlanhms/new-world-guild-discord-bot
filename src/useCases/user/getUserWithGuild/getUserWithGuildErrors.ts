import { UseCaseError } from '../../../shared/logic/UseCaseError';

namespace GetUserWithGuildErrors {
    export class UserNotExists extends UseCaseError {
        constructor() {
            super('você nem existe cara lol.');
        }
    }

    export class UserWithNoGuild extends UseCaseError {
        constructor() {
            super('você não está em nenhuma guilda');
        }
    }

    export class GuildNotExists extends UseCaseError {
        constructor() {
            super('houve um problema ao encontrar sua guilda');
        }
    }
}

export default GetUserWithGuildErrors;
