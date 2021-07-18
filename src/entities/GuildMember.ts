import MembersRole from '../shared/consts/membersRole';

export default class GuildMember {
    public id: string;

    public role: MembersRole;

    public constructor(guildMember: GuildMember) {
        Object.assign(this, guildMember);
    }
}
