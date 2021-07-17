import Handler from '../shared/logic/Handler';
import createGuildHandler from './create';
import pingHandler from './ping';

const allHandlers: Array<Handler> = [pingHandler, createGuildHandler];

export default allHandlers;
