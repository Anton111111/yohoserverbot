import { Scenes } from "telegraf";

const helpScene = new Scenes.BaseScene<Scenes.SceneContext>("help")
helpScene.enter(ctx => ctx.reply("Yo, Ho! Try /login..."))

export default helpScene