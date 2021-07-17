import { UseCaseError } from '../../../shared/logic/UseCaseError';

namespace CreateUserErrors {
    export class AlreadyCreated extends UseCaseError {
        constructor() {
            super('usuário já criado');
        }
    }
}

export default CreateUserErrors;
