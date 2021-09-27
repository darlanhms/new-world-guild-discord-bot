import { Message } from 'discord.js';
import IUserRepository from '../../../repositories/IUserRepository';
import BOT_PREFIX from '../../../shared/consts/botPrefix';
import { specsWithLabel, weaponsWithLabel } from '../../../shared/consts/build';
import Handler from '../../../shared/logic/Handler';

export default class ListBuildsHandler implements Handler {
    name = 'list';

    constructor(private userRepo: IUserRepository) {}

    public async handle(message: Message): Promise<Message> {
        const user = await this.userRepo.get(message.author.id);

        if (!user) {
            return message.reply(
                'Parece que você ainda não existe pra mim, você tem que criar uma build ou entrar em uma guilda!',
            );
        }

        if (!user.builds || !user.builds.length) {
            return message.reply(
                `Você ainda não tem nenhuma build\nCrie uma utlizando o comando \`${BOT_PREFIX} build create\``,
            );
        }

        const buildsMessage = user.builds
            .map(build => {
                const userFriendlySpec = specsWithLabel.find(spec => spec.value === build.spec);
                const userFriendlyFirstWeapon = weaponsWithLabel.find(
                    w => w.value === build.firstWeapon,
                )?.label;
                const userFriendlySecondWeapon = weaponsWithLabel.find(
                    w => w.value === build.secondWeapon,
                )?.label;

                return `**${build.name}:** ${userFriendlySpec?.label} ${userFriendlySpec?.emoji}\n**Primeira arma:** ${userFriendlyFirstWeapon}\n**Segunda arma:** ${userFriendlySecondWeapon}\n`;
            })
            .join('\n');

        return message.reply(`As suas builds atuais são:\n\n${buildsMessage}`);
    }
}
