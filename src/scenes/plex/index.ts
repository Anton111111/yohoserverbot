import { Scenes } from 'telegraf'
import { getHTMLReport, restart, refreshAllPlexLibraries } from '../../util/plex'

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

export const plexRefreshAllScene = new Scenes.BaseScene<Scenes.SceneContext>('plexrefreshall')
plexRefreshAllScene.enter(async (ctx) => {
  ctx.reply('Start refreshing for all Plex libraries...')
  await refreshAllPlexLibraries()
  ctx.scene.leave()
})

export default plexScene
