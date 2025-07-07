import { Scenes } from 'telegraf'
import { bold, fmt } from 'telegraf/format'
import commands from '../../commands'

const helpScene = new Scenes.BaseScene<Scenes.SceneContext>('help')

helpScene.enter((ctx) => ctx.reply(
  fmt`${bold`Yo, Ho!`}
${commands.map((command) => command.help).join("\n")}
`,
))

export default helpScene
