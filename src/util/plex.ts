import axios from 'axios'
import { exec } from 'child_process'

interface PlexSessionsStatusResponse {
  MediaContainer: MediaContainer
}

interface MediaContainer {
  size: number
  Metadata: Array<Metadata>
}

interface Metadata {
  title: string
  grandparentTitle?: string
  type: string
  Player?: PlexPlayer
}

interface PlexPlayer {
  address: string
}

export default async function getPlexSessionStatuses(): Promise<MediaContainer> {
  let mediaContainer: MediaContainer = {
    size: 0,
    Metadata: [],
  }
  try {
    const response = await axios.get<PlexSessionsStatusResponse>(
      `${process.env.PLEX_URL}/status/sessions`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Plex-Token': process.env.PLEX_TOKEN,
        },
      }
    )
    mediaContainer = response.data.MediaContainer
  } catch (e) {
    /* empty */
  }
  return mediaContainer
}

export async function refreshAllPlexLibraries(): Promise<boolean> {
  try {
    const response = await axios.get<PlexSessionsStatusResponse>(
      `${process.env.PLEX_URL}/library/sections/all/refresh`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Plex-Token': process.env.PLEX_TOKEN,
        },
      }
    )
  } catch (e) {
    return false
  }
  return true
}

export async function getHTMLReport(returnIdleMessage: boolean = true): Promise<string> {
  let report = ''
  const plexStatus = await getPlexSessionStatuses()

  if (plexStatus.size > 0) {
    report = 'Looks like someone watch Plex:\n\n'
    plexStatus.Metadata.forEach((metadata) => {
      let metadataStr = metadata.grandparentTitle
        ? `<b>${metadata.grandparentTitle} (${metadata.title})</b>`
        : `<b>${metadata.title}</b>`
      if (metadata.Player && metadata.Player.address) {
        metadataStr = metadataStr.concat(` from ${metadata.Player?.address}`)
      }
      report = report.concat(metadataStr.concat('\n\n'))
    })
  } else if (returnIdleMessage) {
    report = 'I think Plex is idle...'
  }
  return report
}

export function restart() {
  exec('systemctl restart plexmediaserver.service')
}



