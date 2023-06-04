import axios from 'axios'

interface PlexSessionsStatusResponse {
  MediaContainer: MediaContainer
}

interface MediaContainer {
  size: number
  Metadata: Array<Metadata>
}

interface Metadata {
  title: string
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
