import { Scenes } from 'telegraf'
import { getHTMLReport } from '../../util/plex'

const plexScene = new Scenes.BaseScene<Scenes.SceneContext>('plex')
plexScene.enter(async (ctx) => {
  ctx.replyWithHTML(await getHTMLReport())
})

export default plexScene
