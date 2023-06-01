import db from "../../db";
import { loggerWithCtx } from "../../util/logger"
import { Scenes } from "telegraf"
import { message } from "telegraf/filters"

const { leave } = Scenes.Stage;

const loginScene = new Scenes.BaseScene<Scenes.SceneContext>("login")
loginScene.enter(ctx => ctx.reply("Who are you? Say the password!"))
loginScene.command("back", leave<Scenes.SceneContext>());
loginScene.on(message("text"), ctx => {
    if (ctx.message.text == process.env.PASSWORD) {
        try {
            db.put(
                ctx.from.id,
                {
                    id: ctx.from.id,
                    username: ctx.from.username
                }
            )
            ctx.reply("I remember you!")
            ctx.scene.enter("help")
        } catch (e) {
            loggerWithCtx.error(ctx, `Can"t put user. Cause: ${e}`)
            ctx.reply("Something wrong...Try later...")
        }
    } else {
        ctx.reply("You are wrong!")
    }

})
loginScene.on("message", ctx => {
    ctx.reply("Only text messages please!")
})

export default loginScene