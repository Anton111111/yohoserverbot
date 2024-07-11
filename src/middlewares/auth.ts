import { Scenes } from 'telegraf'
import { getKey, getOrNull } from '../db'

const auth = async (ctx: Scenes.SceneContext, next: any) => {
  const user = await getOrNull(getKey(ctx.from.id, ctx.chat.id))
  if (user) {
    return next()
  }
  return ctx.scene.enter('login')
}

export default auth
