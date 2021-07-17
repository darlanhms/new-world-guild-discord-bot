import GuildMember from './GuildMember';

export default class Guild {
    constructor(public name: string, public members: Array<GuildMember>) {}
}
