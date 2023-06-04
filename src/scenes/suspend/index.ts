import { Markup, Scenes } from 'telegraf'
import { TorrentsListFilter, getListOfTorrents } from '../../util/qbittorent'
import suspend from '../../util/system'
import getTorrserverTorrents, { TorrserverTorrentStatus } from '../../util/torrserver'
import getPlexSessionStatuses from '../../util/plex'

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
  if (dTorrents.length - pTorrents.length > 0) {
    ctx.reply(
      'Hey, you have active torrents! Are you sure that you want sleep?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Yes'),
        Markup.button.callback('No', 'No'),
      ])
    )
    return
  }

  const torrents = (await getTorrserverTorrents()).filter(
    (torrent) => torrent.stat !== TorrserverTorrentStatus.IN_DB
  )
  if (torrents.length > 0) {
    ctx.reply(
      'Hey, looks like someone watch torrent by Torrserver! Are you sure that you want sleep?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Yes'),
        Markup.button.callback('No', 'No'),
      ])
    )
    return
  }

  const plexStatus = await getPlexSessionStatuses()
  if (plexStatus.size > 0) {
    ctx.reply(
      'Hey, looks like someone watch Plex! Are you sure that you want sleep?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Yes'),
        Markup.button.callback('No', 'No'),
      ])
    )
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
