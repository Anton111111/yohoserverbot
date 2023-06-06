import { Scenes } from 'telegraf'
import getPlexSessionStatuses from '../../util/plex'

const plexScene = new Scenes.BaseScene<Scenes.SceneContext>('plex')
plexScene.enter(async (ctx) => {
  const plexStatus = await getPlexSessionStatuses()

  if (plexStatus.size > 0) {
    let replyStr = 'Looks like someone watch Plex:\n'
    plexStatus.Metadata.forEach((metadata) => {
      let metadataStr = metadata.grandparentTitle
        ? `<i>- ${metadata.grandparentTitle} (${metadata.title})</i>`
        : `<i>- ${metadata.title}</i>`
      if (metadata.Player && metadata.Player.address) {
        metadataStr = metadataStr.concat(` from ${metadata.Player?.address}`)
      }
      replyStr = replyStr.concat(metadataStr.concat('\n'))
    })
    ctx.replyWithHTML(replyStr)
  } else {
    ctx.replyWithHTML('I think Plex is idle...')
  }
})

export default plexScene
