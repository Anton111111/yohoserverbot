import { Scenes } from 'telegraf'
import { getOrNull } from '../db'

const auth = async (ctx: Scenes.SceneContext, next: any) => {
  const user = await getOrNull(ctx.from.id)
  if (user) {
    return next()
  }
  return ctx.scene.enter('login')
}

export default auth
