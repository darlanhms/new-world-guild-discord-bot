export enum BuildSpec {
    HEALER = 'HEALER',
    DAMAGE = 'DAMAGE',
    TANK = 'TANK',
}

export type Weapon =
    | 'Bow'
    | 'War Hammer'
    | 'Musket'
    | 'Spear'
    | 'Sword'
    | 'Hatchet'
    | 'Rapier'
    | 'Life Stave'
    | 'Fire Stave'
    | 'Ice Gauntlet';

export const weapons = [
    'Bow',
    'War Hammer',
    'Musket',
    'Spear',
    'Sword',
    'Hatchet',
    'Rapier',
    'Life Stave',
    'Fire Stave',
    'Ice Gauntlet',
];

export default class Build {
    public constructor(
        public name: string,

        public spec: BuildSpec,

        public firstWeapon: Weapon,

        public secondWeapon: Weapon,
    ) {}
}
