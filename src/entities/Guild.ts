import GuildMember from './GuildMember';

export default class Guild {
    public name: string;

    public members: Array<GuildMember>;

    public invites?: Array<string>;

    constructor(guild: Guild) {
        Object.assign(this, guild);
    }
}
