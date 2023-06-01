require("dotenv").config()
import { Telegraf, Scenes, session } from "telegraf"
import logger from "./util/logger"
import loginScene from "./scenes/login";
import helpScene from "./scenes/help";
import auth from "./middlewares/auth";


logger.info("Start YoHoServer Bot...");
const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN)
bot.use(session())

const stage = new Scenes.Stage<Scenes.SceneContext>([loginScene, helpScene]);
bot.use(stage.middleware())
bot.use(auth)
bot.command("help", ctx => ctx.scene.enter("help"));

bot.catch((error: any) => {
    logger.error("Global error has happened, %O", error)
});

bot.launch();
bot.telegram.setMyCommands([
    { command: "help", description: "This help" }
])

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))



