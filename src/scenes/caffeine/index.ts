import { Markup, Scenes } from 'telegraf'
import { isCaffeineModeEnabled, enableCaffeine, disableCaffeine } from '../../util/caffeine'

const doEnableCaffeine = (ctx: Scenes.SceneContext) => {
  try {
    enableCaffeine()
    ctx.reply('Caffeine dose taken!')
  } catch (err) {
    console.error('Can\'t enable Caffeine mode:', err);
  }
  ctx.scene.leave()
}

const doDisableCaffeine = (ctx: Scenes.SceneContext) => {
  try {
    disableCaffeine()
    ctx.reply('Caffeine has been removed.')
  } catch (err) {
    console.error('Can\'t disable Caffeine mode:', err);
  }
  ctx.scene.leave()
}

const caffeineScene = new Scenes.BaseScene<Scenes.SceneContext>('caffeine')
caffeineScene.enter(async (ctx) => {

  if (isCaffeineModeEnabled()) {
    ctx.reply(
      'Caffeine mode enabled! Do you want to turn Caffeine mode off?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Disable_Yes'),
        Markup.button.callback('No', 'Disable_No'),
      ])
    )
  } else {
    ctx.reply(
      'Caffeine mode disabled! Do you want to turn Caffeine mode on?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Enable_Yes'),
        Markup.button.callback('No', 'Enable_No'),
      ])
    )
  }
  return
})

caffeineScene.action('Enable_Yes', doEnableCaffeine)
caffeineScene.action('Disable_Yes', doDisableCaffeine)

caffeineScene.action('Enable_No', (ctx) => {
  ctx.reply('I agree that Сaffeine is harmful to health! Right choice!')
  ctx.scene.leave()
})

caffeineScene.action('Disable_No', (ctx) => {
  ctx.reply('Let\'s work some more!')
  ctx.scene.leave()
})

export default caffeineScene
