import { Scenes } from 'telegraf'
import { message } from 'telegraf/filters'
import db, { getKey, writeSnapshot } from '../../db'
import { loggerWithCtx } from '../../util/logger'

const { leave } = Scenes.Stage

const loginScene = new Scenes.BaseScene<Scenes.SceneContext>('login')
loginScene.enter((ctx) => ctx.reply('Who are you? Say the password!'))
loginScene.command('back', leave<Scenes.SceneContext>())
loginScene.on(message('text'), async (ctx) => {
  if (ctx.message.text === process.env.PASSWORD) {
    try {
      await db.put(getKey(ctx.chat.id, ctx.from.id), {
        id: ctx.from.id,
        username: ctx.from.username,
        chatId: ctx.chat.id,
      })
      await writeSnapshot()
      
      ctx.reply('I remember you!')
      ctx.scene.enter('help')
    } catch (e) {
      loggerWithCtx.error(ctx, `Can"t put user. Cause: ${e}`)
      ctx.reply('Something wrong...Try later...')
    }
  } else {
    ctx.reply('You are wrong!')
  }
})
loginScene.on('message', (ctx) => {
  ctx.reply('Only text messages please!')
})

export default loginScene
