import Guild from '../../../entities/Guild';
import User from '../../../entities/User';
import MembersRole from '../../../shared/consts/membersRole';
import UseCase from '../../../shared/logic/UseCase';

export default class IsUserAdminUseCase implements UseCase<User, boolean> {
    /**
     * @note use getUserWithGuild and pass the right result as a parameter here
     */
    public execute(userWithGuild: User): boolean {
        const guild = userWithGuild.guild as Guild;

        const guildMember = guild.members.find(member => member.id === userWithGuild.id);

        if (!guildMember) {
            return false;
        }

        return [MembersRole.MODERATOR, MembersRole.OWNER].includes(guildMember.role);
    }
}
