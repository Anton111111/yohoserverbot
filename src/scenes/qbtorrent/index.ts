import { Scenes } from 'telegraf'
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment'
import { getListOfTorrents } from '../../util/qbittorent'

const torrentsScene = new Scenes.BaseScene<Scenes.SceneContext>('torrents')
torrentsScene.enter(async (ctx) => {
  const torrents = await getListOfTorrents()

  if (torrents.length > 0) {
    let replyStr = 'Yo, Ho! Here is list of torrents:\n'
    torrents.forEach((torrent) => {
      replyStr = replyStr.concat(` - ${torrent.name} (state: ${torrent.state}`)

      if (torrent.state === 'downloading') {
        const etaDuration = moment.duration(torrent.eta * 1000).humanize()
        replyStr = replyStr.concat(` progress: ${(torrent.progress * 100).toFixed(2)}%`)
        replyStr = replyStr.concat(` eta: ${etaDuration}`)
      }

      replyStr = replyStr.concat(')\n')
    })
    ctx.replyWithHTML(replyStr)
  } else {
    ctx.replyWithHTML("Don't see any torrents in list...")
  }
})

export default torrentsScene
