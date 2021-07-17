import Build from './Build';

export default class User {
    constructor(
        public readonly id: string,

        public currentGuild: string,

        public guilds: string[],

        public builds?: Array<Build>,
    ) {}
}
