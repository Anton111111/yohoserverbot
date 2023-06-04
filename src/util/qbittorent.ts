import axios from 'axios'

interface QTorrent {
  hash: string
  name: string
  progress: number
  state: string
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
      `${process.env.QBTORRENT_URL}/api/v2/torrents/info?filter=${filter}`
    )
    torrents.push(...response.data)
  } catch (e) {
    /* empty */
  }
  return torrents
}
