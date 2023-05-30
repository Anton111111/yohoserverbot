require('dotenv').config()
import { Telegraf } from 'telegraf'
import logger, { loggerWithCtx } from './util/logger'
import { exec } from 'child_process';

logger.info('Start YoHoServer Bot...');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.command('hi', async (ctx) => {
    ctx.reply('Yo, Ho!')
});

bot.command('goSleep', async (ctx) => {
    ctx.reply('Went to bed...')
    exec('systemctl suspend')
});


bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error)
});


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



