import Handler from '../shared/logic/Handler';

import createGuildHandler from './create';
import guildInfosHandler from './infos';
import pingHandler from './ping';

const allHandlers: Array<Handler> = [pingHandler, createGuildHandler, guildInfosHandler];

export default allHandlers;
