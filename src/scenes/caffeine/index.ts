import { Markup, Scenes } from 'telegraf'
import { caffeineModeActiveMs, enableCaffeine, disableCaffeine } from '../../util/caffeine'
import { getMsToHumanReadableDate } from '../../util/date';

const caffeineScene = new Scenes.BaseScene<Scenes.SceneContext>('caffeine')
caffeineScene.enter(async (ctx) => {
  const activeMs = caffeineModeActiveMs();
  if (activeMs > 0) {
    ctx.reply(
      `The effect of caffeine will last for another ${getMsToHumanReadableDate(activeMs)}. Do you want to turn Caffeine mode off?`,
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'Disable_Yes'),
        Markup.button.callback('No', 'Disable_No'),
      ])
    )
  } else {
    ctx.reply(
      'What dose of caffeine should I take??',
      Markup.inlineKeyboard([
        Markup.button.callback('30 min', 'Enable_Yes:30'),
        Markup.button.callback('1 hour', 'Enable_Yes:60'),
        Markup.button.callback('2 hours', 'Enable_Yes:120'),
        Markup.button.callback('3 hours', 'Enable_Yes:180'),
        Markup.button.callback('Cancel', 'Enable_No'),
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
