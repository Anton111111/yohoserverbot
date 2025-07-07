import { Telegraf, Scenes, session } from 'telegraf'
import auth from './middlewares/auth'
import logger from './util/logger'
import commands from './commands'

require('dotenv').config()

logger.info('Start YoHoServer Bot...')
const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN)
bot.use(session())

const stage = new Scenes.Stage<Scenes.SceneContext>(commands.map((command) => command.scene))

bot.use(stage.middleware())
bot.use(auth)
commands.forEach(command => {
  bot.command(command.command, (ctx) => ctx.scene.enter(command.command))
});


bot.catch((error: any) => {
  logger.error('Global error has happened, %O', error)
})

bot.telegram.setMyCommands(commands)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
