import { Scenes } from 'telegraf'
import getPlexSessionStatuses from '../../util/plex'

const plexScene = new Scenes.BaseScene<Scenes.SceneContext>('plex')
plexScene.enter(async (ctx) => {
  const plexStatus = await getPlexSessionStatuses()

  if (plexStatus.size > 0) {
    let replyStr = 'Looks like someone watch Plex:\n'
    plexStatus.Metadata.forEach((metadata) => {
      replyStr = replyStr.concat(`<i>- ${metadata.title}</i>\n`)
    })
    ctx.replyWithHTML(replyStr)
  } else {
    ctx.replyWithHTML('I think Plex is idle...')
  }
})

export default plexScene
