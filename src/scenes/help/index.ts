import { Scenes } from 'telegraf'
import { bold, fmt } from 'telegraf/format'

const helpScene = new Scenes.BaseScene<Scenes.SceneContext>('help')
helpScene.enter((ctx) => ctx.reply(
  fmt`${bold`Yo, Ho!`}
Use /help to see this help.
Use /systeminfo to get short system info.
Use /torrserver to view active torrents on Torrserver.
`,
))

export default helpScene
