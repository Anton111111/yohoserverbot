import { Telegraf, Scenes, session } from 'telegraf'
import * as https from 'https'
import auth from './middlewares/auth'
import logger from './util/logger'
import commands from './commands'
import loginScene from './scenes/login'

require('dotenv').config()

logger.info('Start YoHoServer Bot...')
const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN, {
  telegram: {
    agent: new https.Agent({ keepAlive: true, keepAliveMsecs: 10000 }),
  },
})
bot.use(session())

const scenes = commands.map((command) => command.scene)
scenes.push(loginScene)
const stage = new Scenes.Stage<Scenes.SceneContext>(scenes)

bot.use(stage.middleware())
bot.use(auth)
commands.forEach(command => {
  bot.command(command.command, (ctx) => ctx.scene.enter(command.scene.id))
});


bot.catch((error: any) => {
  logger.error('Global error has happened, %O', error)
})

bot.telegram.setMyCommands(commands)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
