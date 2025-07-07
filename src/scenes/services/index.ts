import { Scenes } from 'telegraf'
import { restart as plexRestart } from '../../util/plex'
import { restart as torrserverRestart } from '../../util/torrserver'
import { restart as qbittorentRestart } from '../../util/qbittorent'

export const servicesRestartScene = new Scenes.BaseScene<Scenes.SceneContext>('servicesrestart')
servicesRestartScene.enter(async (ctx) => {
  ctx.reply('Trying to restart All services...')
  setTimeout(() => {
    plexRestart()
    torrserverRestart()
    qbittorentRestart()
  }, 1000)
  ctx.scene.leave()
})

export default servicesRestartScene
