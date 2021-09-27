export enum BuildSpec {
    HEALER = 'HEALER',
    DAMAGE = 'DAMAGE',
    TANK = 'TANK',
}

export enum Weapon {
    BOW = 'Bow',
    WAR_HAMMER = 'War Hammer',
    GREAT_AXE = 'Great Axe',
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
    { value: Weapon.BOW, label: 'Arco' },
    { value: Weapon.WAR_HAMMER, label: 'Martelão' },
    { value: Weapon.GREAT_AXE, label: 'Machadão' },
    { value: Weapon.MUSKET, label: 'Mosquete' },
    { value: Weapon.SPEAR, label: 'Lança' },
    { value: Weapon.SWORD, label: 'Espada & Escudo' },
    { value: Weapon.HATCHET, label: 'Machadinha' },
    { value: Weapon.RAPIER, label: 'Rapieira' },
    { value: Weapon.LIFE_STAFF, label: 'Cajado de vida' },
    { value: Weapon.FIRE_STAFF, label: 'Cajado de fogo' },
    { value: Weapon.ICE_GAUNTLET, label: 'Manopla de gelo' },
];

export const specsWithLabel = [
    {
        label: 'Dano',
        value: BuildSpec.DAMAGE,
        emoji: '⚔️',
    },
    {
        label: 'Tanque',
        value: BuildSpec.TANK,
        emoji: '🛡️',
    },
    {
        label: 'Cura',
        value: BuildSpec.HEALER,
        emoji: '🚑',
    },
];
