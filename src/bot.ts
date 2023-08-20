import { Telegraf, Scenes, session } from 'telegraf'
import auth from './middlewares/auth'
import logger from './util/logger'
import loginScene from './scenes/login'
import helpScene from './scenes/help'
import suspendScene from './scenes/suspend'
import systemInfoScene from './scenes/systeminfo'
import torrserverScene from './scenes/torrserver'
import plexScene, { plexRestartScene } from './scenes/plex'
import torrentsScene from './scenes/qbittorrent'
import summaryScene from './scenes/summary'

require('dotenv').config()

logger.info('Start YoHoServer Bot...')
const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN)
bot.use(session())

const stage = new Scenes.Stage<Scenes.SceneContext>([
  loginScene,
  helpScene,
  summaryScene,
  systemInfoScene,
  suspendScene,
  torrserverScene,
  torrentsScene,
  plexScene,
  plexRestartScene
])
bot.use(stage.middleware())
bot.use(auth)
bot.command('help', (ctx) => ctx.scene.enter('help'))
bot.command('summary', (ctx) => ctx.scene.enter('summary'))
bot.command('systeminfo', (ctx) => ctx.scene.enter('systeminfo'))
bot.command('torrserver', (ctx) => ctx.scene.enter('torrserver'))
bot.command('plex', (ctx) => ctx.scene.enter('plex'))
bot.command('plexrestart', (ctx) => ctx.scene.enter('plexrestart'))
bot.command('torrents', (ctx) => ctx.scene.enter('torrents'))
bot.command('sleep', (ctx) => ctx.scene.enter('suspend'))

bot.catch((error: any) => {
  logger.error('Global error has happened, %O', error)
})

bot.telegram.setMyCommands([
  { command: 'help', description: 'Read this help' },
  { command: 'summary', description: 'View summary status' },
  { command: 'systeminfo', description: 'View short system info' },
  { command: 'torrserver', description: 'View active torrents on Torrserver' },
  { command: 'torrents', description: 'View list of torrents' },
  { command: 'plex', description: 'View active sessions on Plex' },
  { command: 'plexrestart', description: 'Restart Plex service' },
  { command: 'sleep', description: 'Go to sleep' },
])

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
