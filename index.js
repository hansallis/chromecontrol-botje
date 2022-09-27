require('dotenv').config()
const Ably = require('ably');

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ably = new Ably.Realtime(process.env.ABLY_TOKEN);
var channel = ably.channels.get('chromecontrol');

bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('message', (ctx) => {
    if(ctx.update.message.entities) {
        let urls = ctx.update.message.entities.filter(entity => entity.type === 'url');
        if (urls.length > 0) {
            ctx.reply('Got it!');
        }
        urls.forEach(entity =>
            {
                let url = ctx.update.message.text.substr(entity.offset, entity.length);
                if (!url.match('^https?:')) {
                    url = 'https://' + url;
                }
                console.log('URL:' + url);
                channel.publish('url', url);
            }
        )
    }
});
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));