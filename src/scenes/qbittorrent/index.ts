import { Scenes } from 'telegraf'
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment'
import { getListOfTorrents } from '../../util/qbittorent'

const torrentsScene = new Scenes.BaseScene<Scenes.SceneContext>('torrents')
torrentsScene.enter(async (ctx) => {
  const torrents = await getListOfTorrents()

  if (torrents.length > 0) {
    let replyStr = 'Yo, Ho! Here is list of torrents:\n\n'
    torrents.forEach((torrent) => {
      replyStr = replyStr.concat(`<b>${torrent.name}</b> (state: <i>${torrent.state}</i>`)

      if (torrent.state === 'downloading') {
        const etaDuration = moment.duration(torrent.eta * 1000).humanize()
        replyStr = replyStr.concat(` progress: <i>${(torrent.progress * 100).toFixed(2)}%</i>`)
        replyStr = replyStr.concat(` eta: <i>${etaDuration}</i>`)
      }

      replyStr = replyStr.concat(')\n\n')
    })
    ctx.replyWithHTML(replyStr)
  } else {
    ctx.replyWithHTML("Don't see any torrents in list...")
  }
})

export default torrentsScene
