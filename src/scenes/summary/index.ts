import { Scenes } from 'telegraf'
import { getHTMLReport as qbittorentHtmlReport } from '../../util/qbittorent'
import { getHTMLReport as plexHtmlReport } from '../../util/plex'
import { getHTMLReport as torrserverHtmlReport } from '../../util/torrserver'

const summaryScene = new Scenes.BaseScene<Scenes.SceneContext>('summary')
summaryScene.enter(async (ctx) => {
  let fullReport: string = ''
  const reports = [qbittorentHtmlReport(true), plexHtmlReport(true), torrserverHtmlReport(true)]
  Promise.all(reports).then(_reports => {
    _reports.forEach(singleReport => {
      if (singleReport) {
        fullReport += `${singleReport}\n\n`
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
