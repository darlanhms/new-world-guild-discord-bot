import Build from './Build';
import Guild from './Guild';

export default class User {
    public readonly id: string;

    public guilds: string[];

    public currentGuild?: string;

    public builds?: Array<Build>;

    /** use for joins only, this is not part of user's record */
    public guild?: Guild;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
