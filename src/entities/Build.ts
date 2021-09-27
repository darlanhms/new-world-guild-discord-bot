import { BuildSpec, Weapon } from '../shared/consts/build';

export default class Build {
    public name: string;

    public spec: BuildSpec;

    public firstWeapon: Weapon;

    public secondWeapon: Weapon;

    public constructor(build: Build) {
        Object.assign(this, build);
    }
}
