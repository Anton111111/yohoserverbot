import { Scenes } from 'telegraf'
import { getHTMLReport as qbittorentHtmlReport } from '../../util/qbittorent'
import { getHTMLReport as plexHtmlReport } from '../../util/plex'
import { getHTMLReport as torrserverHtmlReport } from '../../util/torrserver'
import { getHTMLReport as caffeineHtmlReport } from '../../util/caffeine'

const summaryScene = new Scenes.BaseScene<Scenes.SceneContext>('summary')
summaryScene.enter(async (ctx) => {
  let fullReport: string = caffeineHtmlReport()
  const reports = [qbittorentHtmlReport(false), plexHtmlReport(false), torrserverHtmlReport(false)]
  Promise.all(reports).then(_reports => {
    _reports.forEach(singleReport => {
      if (singleReport) {
        fullReport += `${singleReport}\n`
      }
    })
    if (fullReport) {
      ctx.replyWithHTML(fullReport)
    } else {
      ctx.replyWithHTML('There are complete calm...\nServer is idle...')
    }
  })
})

export default summaryScene
