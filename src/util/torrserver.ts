import axios from 'axios'

interface Torrent {
  hash: string
  title: string
  stat: number
}

export enum TorrserverTorrentStatus {
  ADDED = 0,
  GETTING_INFO = 1,
  PRELOAD = 2,
  WORKING = 3,
  CLOSED = 4,
  IN_DB = 5
}

export default async function getTorrserverTorrents(): Promise<Array<Torrent>> {
  const torrents: Array<Torrent> = []
  try {
    const response = await axios.post<Array<Torrent>>(
      `${process.env.TORRSERVER_URL}/torrents`,
      { action: 'list' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.TORRSERVER_USERNAME,
          password: process.env.TORRSERVER_PASSWORD,
        },
      }
    )
    torrents.push(...response.data)
  } catch (e) {
    /* empty */
  }
  return torrents
}

export async function getHTMLReport(returnIdleMessage: boolean = true): Promise<string> {
  let report = ''
  const torrents = (await getTorrserverTorrents()).filter(
    (torrent) => torrent.stat !== TorrserverTorrentStatus.IN_DB
  )

  if (torrents.length > 0) {
    report = 'Looks like someone watch torrents:\n\n'
    torrents.forEach((torrent) => {
      report = report.concat(`<b>${torrent.title}</b>\n\n`)
    })
  } else if (returnIdleMessage) {
    report = 'I think Torrserver is idle...'
  }
  return report
}
