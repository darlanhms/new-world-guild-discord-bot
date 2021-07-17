import MembersRole from '../shared/consts/membersRole';

export default class GuildMember {
    public constructor(public id: string, public role: MembersRole) {}
}
