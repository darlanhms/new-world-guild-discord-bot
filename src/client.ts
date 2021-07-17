import { Client } from 'discord.js';

const client = new Client();

client.login(process.env.BOT_TOKEN);

export default client;
