import { Scenes } from 'telegraf'
import { getHTMLReport } from '../../util/torrserver'

const torrserverScene = new Scenes.BaseScene<Scenes.SceneContext>('torrserver')
torrserverScene.enter(async (ctx) => {
  ctx.replyWithHTML(await getHTMLReport())
})

export default torrserverScene
