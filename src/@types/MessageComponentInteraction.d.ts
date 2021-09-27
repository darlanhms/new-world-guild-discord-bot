/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageComponentInteraction } from 'discord.js';

declare module 'discord.js' {
    interface MessageComponentInteraction {
        values: Array<string>;
    }
}
