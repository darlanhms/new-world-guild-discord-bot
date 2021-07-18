import Handler from '../shared/logic/Handler';

import createGuildHandler from './create';
import guildInfosHandler from './infos';
import inviteHandler from './invite';
import listGuildsHandler from './list';
import pingHandler from './ping';
import setGuildHandler from './set';

const allHandlers: Array<Handler> = [
    pingHandler,
    createGuildHandler,
    guildInfosHandler,
    inviteHandler,
    setGuildHandler,
    listGuildsHandler,
];

export default allHandlers;
