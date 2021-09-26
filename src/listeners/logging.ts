import client from '../client';

client.on('ready', () => {
    console.log('client ready for listenners');
});

client.on('error', e => {
    console.log(`error on connection: ${e.toString()}`);
});
