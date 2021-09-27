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

export const weaponsWithLabel = [
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

export const specsWithLabel = [
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
