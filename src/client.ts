import { Client, Intents } from 'discord.js';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

client.login(process.env.BOT_TOKEN);

export default client;
