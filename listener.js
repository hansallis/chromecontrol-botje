require('dotenv').config()
const Ably = require('ably');

const ably = new Ably.Realtime(process.env.ABLY_TOKEN);

ably.connection.on('connected', function() {
    var channel = ably.channels.get('chromecontrol');

    channel.subscribe('url', (message => {
        console.log(message)
    }))
})