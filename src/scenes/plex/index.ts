import { Scenes } from 'telegraf'
import { getHTMLReport, restart } from '../../util/plex'

const plexScene = new Scenes.BaseScene<Scenes.SceneContext>('plex')
plexScene.enter(async (ctx) => {
  ctx.replyWithHTML(await getHTMLReport())
})

export const plexRestartScene = new Scenes.BaseScene<Scenes.SceneContext>('plexrestart')
plexRestartScene.enter(async (ctx) => {
  ctx.reply('Trying to restart Plex...')
  setTimeout(() => {
    restart()
  }, 1000)
  ctx.scene.leave()
})

export default plexScene
