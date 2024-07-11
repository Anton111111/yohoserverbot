import { Scenes } from 'telegraf'
import { getHTMLReport } from '../../util/qbittorent'

const torrentsScene = new Scenes.BaseScene<Scenes.SceneContext>('torrents')
torrentsScene.enter(async (ctx) => {
  ctx.replyWithHTML(await getHTMLReport())
})

export default torrentsScene
