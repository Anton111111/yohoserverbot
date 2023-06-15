import axios from 'axios'
import moment from 'moment'

interface QTorrent {
  hash: string
  name: string
  progress: number
  state: string
  eta: number
}

export enum TorrentsListFilter {
  NONE = '',
  Downloading = 'downloading',
  Paused = 'paused',
}

export async function getListOfTorrents(
  filter: TorrentsListFilter = TorrentsListFilter.NONE
): Promise<Array<QTorrent>> {
  const torrents: Array<QTorrent> = []
  try {
    const response = await axios.get<Array<QTorrent>>(
      `${process.env.QBITTORRENT_URL}/api/v2/torrents/info?filter=${filter}`
    )
    torrents.push(...response.data)
  } catch (e) {
    /* empty */
  }
  return torrents
}

export async function getHTMLReport(nullOnIdle: boolean = false): Promise<string | null> {
  const torrents = await getListOfTorrents()
  let report: string | null = null
  if (torrents.length > 0) {
    report = 'Yo, Ho! Here is list of torrents:\n\n'
    torrents.forEach((torrent) => {
      report = report.concat(`<b>${torrent.name}</b> (state: <i>${torrent.state}</i>`)

      if (torrent.state === 'downloading') {
        const etaDuration = moment.duration(torrent.eta * 1000).humanize()
        report = report.concat(` progress: <i>${(torrent.progress * 100).toFixed(2)}%</i>`)
        report = report.concat(` eta: <i>${etaDuration}</i>`)
      }

      report = report.concat(')\n\n')
    })
  } else if (!nullOnIdle) {
    report = "Don't see any torrents in list..."
  }

  return report
}
