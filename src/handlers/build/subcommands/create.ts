import {
    AwaitMessageComponentOptions,
    Message,
    MessageActionRow,
    MessageComponentInteraction,
    MessageSelectMenu,
    MessageSelectOptionData,
} from 'discord.js';
import { v4 as uuid } from 'uuid';
import { BuildSpec, Weapon } from '../../../entities/Build';
import Handler from '../../../shared/logic/Handler';

type AwaitOptions = AwaitMessageComponentOptions<MessageComponentInteraction>;

interface CreateSelectOptions {
    id: string;
    placeholder: string;
    options: MessageSelectOptionData[];
}

interface StepsOptions {
    message: Message;
    replyMessage: Message;
    baseMessage: string;
}

interface WeaponStepOptions {
    firstWeapon?: MessageSelectOptionData;
}

const possibleWeapons: Array<MessageSelectOptionData> = [
    { value: Weapon.BOW, label: 'Bow' },
    { value: Weapon.WAR_HAMMER, label: 'War Hammer' },
    { value: Weapon.MUSKET, label: 'Musket' },
    { value: Weapon.SPEAR, label: 'Spear' },
    { value: Weapon.SWORD, label: 'Sword' },
    { value: Weapon.HATCHET, label: 'Hatchet' },
    { value: Weapon.RAPIER, label: 'Rapier' },
    { value: Weapon.LIFE_STAFF, label: 'Life Staff' },
    { value: Weapon.FIRE_STAFF, label: 'Fire Staff' },
    { value: Weapon.ICE_GAUNTLET, label: 'Ice Gauntlet' },
];

const possibleSpecs: Array<MessageSelectOptionData> = [
    {
        label: 'Damage',
        value: BuildSpec.DAMAGE,
        emoji: '⚔️',
    },
    {
        label: 'Tank',
        value: BuildSpec.TANK,
        emoji: '🛡️',
    },
    {
        label: 'Healer',
        value: BuildSpec.HEALER,
        emoji: '🏥',
    },
];

export default class CreateBuildHandler implements Handler {
    name = 'create';

    public async handle(message: Message): Promise<void> {
        const baseMessage = 'Siga os passos abaixo para montar a sua build :point_down_tone1:\n\n';

        const [replyMessage, selectedSpec] = await this.askForSpec({
            message,
            baseMessage,
        });

        const selectedSpecMessage = `**Spec:** ${selectedSpec.label}\n`;

        const selectedFirstWeapon = await this.askForWeapon({
            message,
            replyMessage,
            baseMessage: baseMessage + selectedSpecMessage,
        });

        const firstWeaponMessage = `**Primeira arma:** ${selectedFirstWeapon.label}\n`;

        const selectedSecondWeapon = await this.askForWeapon({
            message,
            replyMessage,
            firstWeapon: selectedFirstWeapon,
            baseMessage: baseMessage + selectedSpecMessage + firstWeaponMessage,
        });

        const secondWeaponMessage = `**Segunda arma:** ${selectedSecondWeapon.label}\n`;

        const finalBuildMessage = `\nA sua build final é ***${selectedSpec.label}*** com as armas **${selectedFirstWeapon.label}** e **${selectedSecondWeapon.label}**?`;

        const finalMessages =
            baseMessage + selectedSpecMessage + firstWeaponMessage + secondWeaponMessage + finalBuildMessage;

        await replyMessage.edit({
            content: finalMessages,
            components: [],
        });

        replyMessage.react('✅');
        replyMessage.react('❌');

        const confirmBuildInteraction = await replyMessage.awaitReactions({
            filter: (reaction, user) =>
                user.id === message.author.id && ['✅', '❌'].includes(reaction.emoji.name || ''),
            max: 1,
        });

        await replyMessage.reactions.removeAll();

        const confirmEmoji = confirmBuildInteraction.first()?.emoji.name as string;

        if (confirmEmoji === '❌') {
            replyMessage.edit({
                content: `${finalMessages}\n\n:x: Que pena, a build que você acabou de criar foi pro espaço :face_exhaling:`,
            });
        } else if (confirmEmoji === '✅') {
            replyMessage.edit({
                content: `${finalMessages}\n\n:white_check_mark: Build criada com sucesso! Lembre-se, essa build não é atrelada a guilda atual, você pode usá-la onde quiser :star_struck:`,
            });
        }
    }

    private async askForSpec({
        message,
        baseMessage,
    }: Omit<StepsOptions, 'replyMessage'>): Promise<[Message, MessageSelectOptionData]> {
        const specSelectId = uuid();

        const specSelect = this.createSelect({
            id: specSelectId,
            placeholder: 'Escolha o tipo de build',
            options: possibleSpecs,
        });

        const replyMessage = await message.reply({
            content: baseMessage,
            components: [specSelect],
        });

        const specInteraction = await replyMessage.awaitMessageComponent(
            this.createSelectAwaitOptions(specSelectId, message.author.id),
        );

        const selectedSpec = possibleSpecs.find(s => s.value === specInteraction.values[0]);

        return [replyMessage, selectedSpec as MessageSelectOptionData];
    }

    private async askForWeapon({
        message,
        replyMessage,
        baseMessage,
        firstWeapon,
    }: StepsOptions & WeaponStepOptions): Promise<MessageSelectOptionData> {
        const selectedId = uuid();

        const weaponsToSelect = firstWeapon
            ? possibleWeapons.filter(w => w.value !== firstWeapon.value)
            : possibleWeapons;

        const weaponSelect = this.createSelect({
            id: selectedId,
            placeholder: `Escolha a ${firstWeapon ? 'segunda' : 'primeira'} arma`,
            options: weaponsToSelect,
        });

        await replyMessage.edit({
            content: baseMessage,
            components: [weaponSelect],
        });

        const weaponInteraction = await replyMessage.awaitMessageComponent(
            this.createSelectAwaitOptions(selectedId, message.author.id),
        );

        const selectedWeapon = possibleWeapons.find(w => w.value === weaponInteraction.values[0]);

        return selectedWeapon as MessageSelectOptionData;
    }

    private createSelect({ id, options, placeholder }: CreateSelectOptions): MessageActionRow {
        return new MessageActionRow().addComponents(
            new MessageSelectMenu().setCustomId(id).setPlaceholder(placeholder).addOptions(options),
        );
    }

    private createSelectAwaitOptions(
        selectId: string,
        authorId: string,
        overrides?: AwaitOptions,
    ): AwaitOptions {
        return {
            filter: async comp => {
                await comp.deferUpdate();

                return comp.customId === selectId && comp.user.id === authorId;
            },
            componentType: 'SELECT_MENU',
            ...overrides,
        };
    }
}
