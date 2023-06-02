import axios from 'axios'

interface Torrent {
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
): Promise<Array<Torrent>> {
  const torrents: Array<Torrent> = []
  try {
    const response = await axios.get<Array<Torrent>>(`${process.env.QBTORRENT_URL}/api/v2/torrents/info?filter=${filter}`)
    torrents.push(...response.data)
  } catch (e) { /* empty */ }
  return torrents
}
