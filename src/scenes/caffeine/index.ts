import { Markup, Scenes } from 'telegraf'
import fs from 'fs'

const enableCaffeine = (ctx: Scenes.SceneContext) => {
  try {
    fs.writeFileSync(process.env.CAFFEINE_FILE_PATH, 'caffeine', 'utf-8');
    ctx.reply('Enable Caffeine mode.')
  } catch (err) {
    console.error('Can\'t enable Caffeine mode:', err);
  }
  ctx.scene.leave()
}

const disableCaffeine = (ctx: Scenes.SceneContext) => {
  try {
    fs.unlinkSync(process.env.CAFFEINE_FILE_PATH);
    ctx.reply('Enable Caffeine mode.')
  } catch (err) {
    console.error('Can\'t disable Caffeine mode:', err);
  }
  ctx.reply('Disable Caffeine mode.')
  ctx.scene.leave()
}

const caffeineScene = new Scenes.BaseScene<Scenes.SceneContext>('caffeine')
caffeineScene.enter(async (ctx) => {
  fs.stat(process.env.CAFFEINE_FILE_PATH, (exists) => {
    if (exists == null) {
      ctx.reply(
        'Caffeine mode disabled! Do you want to turn Caffeine mode on?',
        Markup.inlineKeyboard([
          Markup.button.callback('Yes', 'Enable_Yes'),
          Markup.button.callback('No', 'Enable_No'),
        ])
      )
    } else if (exists.code === 'ENOENT') {
      ctx.reply(
        'Caffeine mode enabled! Do you want to turn Caffeine mode off?',
        Markup.inlineKeyboard([
          Markup.button.callback('Yes', 'Disable_Yes'),
          Markup.button.callback('No', 'Disable_No'),
        ])
      )
    }
  });


  return
})

caffeineScene.action('Enable_Yes', enableCaffeine)
caffeineScene.action('Disable_Yes', disableCaffeine)

caffeineScene.action('Enable_No', (ctx) => {
  ctx.reply('I agree that caffeine is harmful to health! Right choice!')
  ctx.scene.leave()
})

caffeineScene.action('Disable_No', (ctx) => {
  ctx.reply('Let\'s work some more!')
  ctx.scene.leave()
})

export default caffeineScene
