import { Scenes } from 'telegraf'
import getTorrserverTorrents, { TorrserverTorrentStatus } from '../../util/torrserver'

const torrserverScene = new Scenes.BaseScene<Scenes.SceneContext>('torrserver')
torrserverScene.enter(async (ctx) => {
  const torrents = (await getTorrserverTorrents()).filter(
    (torrent) => torrent.stat !== TorrserverTorrentStatus.IN_DB
  )

  if (torrents.length > 0) {
    let torrentsStr = 'Looks like someone watch torrents:\n\n'
    torrents.forEach((torrent) => {
      torrentsStr = torrentsStr.concat(`<b>${torrent.title}</b>\n\n`)
    })
    ctx.replyWithHTML(torrentsStr)
  } else {
    ctx.replyWithHTML('I think Torrserver is idle...')
  }
})

export default torrserverScene
