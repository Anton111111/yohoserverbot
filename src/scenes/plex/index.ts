import { Scenes } from 'telegraf'
import getPlexSessionStatuses from '../../util/plex'

const plexScene = new Scenes.BaseScene<Scenes.SceneContext>('plex')
plexScene.enter(async (ctx) => {
  const plexStatus = await getPlexSessionStatuses()

  if (plexStatus.size > 0) {
    let replyStr = 'Looks like someone watch Plex:\n'
    plexStatus.Metadata.forEach((metadata) => {
      let metadataStr = metadata.grandparentTitle
        ? `<b>${metadata.grandparentTitle} (${metadata.title})</b>`
        : `<b>${metadata.title}</b>`
      if (metadata.Player && metadata.Player.address) {
        metadataStr = metadataStr.concat(` from ${metadata.Player?.address}`)
      }
      replyStr = rplyStr.concat(metadataStr.concat('\n\n'))
    })
    ctx.replyWithHTML(replyStr)
  } else {
    ctx.replyWithHTML('I think Plex is idle...')
  }
})

export default plexScene
