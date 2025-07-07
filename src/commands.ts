import caffeineScene from "./scenes/caffeine"
import helpScene from "./scenes/help"
import plexScene, { plexRefreshAllScene } from "./scenes/plex"
import torrentsScene from "./scenes/qbittorrent"
import shutdownScene from "./scenes/shutdown"
import summaryScene from "./scenes/summary"
import suspendScene from "./scenes/suspend"
import systemInfoScene from "./scenes/systeminfo"
import torrserverScene from "./scenes/torrserver"

const commands = [
    { command: 'help', scene: helpScene, description: 'Read this help', help: 'Use /help to see this help.' },
    { command: 'summary', scene: summaryScene, description: 'View summary status', help: 'Use /summary to view summary status.' },
    { command: 'systeminfo', scene: systemInfoScene, description: 'View short system info', help: 'Use /systeminfo to get short system info.' },
    { command: 'torrserver', scene: torrserverScene, description: 'View active torrents on Torrserver', help: 'Use /torrserver to view active torrents on Torrserver.' },
    { command: 'torrents', scene: torrentsScene, description: 'View list of torrents', help: 'Use /torrents to view list of torrents.' },
    { command: 'plex', scene: plexScene, description: 'View active sessions on Plex', help: 'Use /plex to view active sessions on Plex.' },
    { command: 'plexrefreshall', scene: plexRefreshAllScene, description: 'Refresh all Plex libraries', help: 'Use /plexrefreshall to refresh all Plex libraries.' },
    { command: 'plexrestart', scene: plexScene, description: 'Restart Plex service', help: 'Use /plexrestart to restart Plex service.' },
    { command: 'sleep', scene: suspendScene, description: 'Go to sleep', help: 'Use /suspend Go to sleep.' },
    { command: 'shutdown', scene: shutdownScene, description: 'Shutdown', help: 'Use /shutdown to shutdown YoHoServer.' },
    { command: 'caffeine', scene: caffeineScene, description: 'Caffeine mode', help: 'Use /caffeine to enable/disable Caffeine mode.' },
]

export default commands












