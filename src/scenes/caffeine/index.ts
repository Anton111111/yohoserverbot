import { Markup, Scenes } from 'telegraf'
import { isCaffeineModeEnabled, enableCaffeine, disableCaffeine } from '../../util/caffeine'




const caffeineScene = new Scenes.BaseScene<Scenes.SceneContext>('caffeine')
caffeineScene.enter(async (ctx) => {

  if (isCaffeineModeEnabled()) {
    ctx.reply(
      'Caffeine mode enabled! Do you want to turn Caffeine mode off?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Disable_Yes', true),
        Markup.button.callback('No', 'Disable_No', true),
      ])
    )
  } else {
    ctx.reply(
      'What dose of caffeine should I take??',
      Markup.inlineKeyboard([
        Markup.button.callback('30 min', 'Enable_Yes:30', true),
        Markup.button.callback('1 hour', 'Enable_Yes:60', true),
        Markup.button.callback('2 hours', 'Enable_Yes:120', true),
        Markup.button.callback('3 hours', 'Enable_Yes:180', true),
        Markup.button.callback('Cancel', 'Enable_No', true),
      ])
    )
  }
  return
})

caffeineScene.action(/Enable_Yes:(.+)/, (ctx) => {
  try {
    const threshold = parseInt(ctx.match[1]) * 60;
    enableCaffeine(threshold)
    ctx.reply('Caffeine dose taken!')
  } catch (err) {
    console.error('Can\'t enable Caffeine mode:', err);
  }
  ctx.scene.leave()
})
caffeineScene.action('Disable_Yes', (ctx) => {
  try {
    disableCaffeine()
    ctx.reply('Caffeine has been removed.')
  } catch (err) {
    console.error('Can\'t disable Caffeine mode:', err);
  }
  ctx.scene.leave()
})

caffeineScene.action('Enable_No', (ctx) => {
  ctx.reply('I agree that Сaffeine is harmful to health! Right choice!')
  ctx.scene.leave()
})

caffeineScene.action('Disable_No', (ctx) => {
  ctx.reply('Let\'s work some more!')
  ctx.scene.leave()
})

export default caffeineScene
