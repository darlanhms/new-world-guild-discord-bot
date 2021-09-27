export enum BuildSpec {
    HEALER = 'HEALER',
    DAMAGE = 'DAMAGE',
    TANK = 'TANK',
}

export enum Weapon {
    BOW = 'Bow',
    WAR_HAMMER = 'War Hammer',
    MUSKET = 'Musket',
    SPEAR = 'Spear',
    SWORD = 'Sword',
    HATCHET = 'Hatchet',
    RAPIER = 'Rapier',
    LIFE_STAFF = 'Life Staff',
    FIRE_STAFF = 'Fire Staff',
    ICE_GAUNTLET = 'Ice Gauntlet',
}

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
    public name: string;

    public spec: BuildSpec;

    public firstWeapon: Weapon;

    public secondWeapon: Weapon;

    public constructor(build: Build) {
        Object.assign(this, build);
    }
}
