import { Markup, Scenes } from 'telegraf'
import { TorrentsListFilter, getListOfTorrents } from '../../util/qbittorent'
import suspend from '../../util/system'

const goToSuspend = (ctx: Scenes.SceneContext) => {
  ctx.reply('Trying to fall asleep...')
  setTimeout(() => {
    suspend()
  }, 1000)
  ctx.scene.leave()
}

const suspendScene = new Scenes.BaseScene<Scenes.SceneContext>('suspend')
suspendScene.enter(async (ctx) => {
  const dTorrents = await getListOfTorrents(TorrentsListFilter.Downloading)
  const pTorrents = await getListOfTorrents(TorrentsListFilter.Paused)
  if ((dTorrents.length - pTorrents.length) > 0) {
    ctx.reply('Hey, you have active torrents! Are you sure that you want sleep?', Markup.inlineKeyboard([
      Markup.button.callback('Yes', 'Yes'),
      Markup.button.callback('No', 'No'),
    ]))
    return
  }
  goToSuspend(ctx)
})

suspendScene.action('Yes', goToSuspend)

suspendScene.action('No', (ctx) => {
  ctx.reply('Right choice!')
  ctx.scene.leave()
})

export default suspendScene
