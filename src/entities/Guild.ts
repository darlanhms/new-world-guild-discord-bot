import { v4 as uuid } from 'uuid';
import GuildMember from './GuildMember';

export default class Guild {
    constructor(public name: string, public members: Array<GuildMember>, public readonly id?: string) {
        if (!id) {
            this.id = uuid();
        }
    }
}
