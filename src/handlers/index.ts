import Handler from '../shared/logic/Handler';
import buildHandler from './build';

import createGuildHandler from './create';
import guildInfosHandler from './infos';
import inviteHandler from './invite';
import listGuildsHandler from './list';
import modGuildHandler from './mod';
import pingHandler from './ping';
import quitHandler from './quit';
import setGuildHandler from './set';

const allHandlers: Array<Handler> = [
    pingHandler,
    createGuildHandler,
    guildInfosHandler,
    inviteHandler,
    setGuildHandler,
    listGuildsHandler,
    modGuildHandler,
    quitHandler,
    buildHandler,
];

export default allHandlers;
