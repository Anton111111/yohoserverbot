import commandLineArgs from 'command-line-args'
import { Telegraf } from 'telegraf'
import logger from './util/logger'
import { readSnapshot } from './db'

require('dotenv').config()

const optionDefinitions = [
  { name: 'action', alias: 'a', type: String },
  { name: 'name', alias: 'n', type: String },
  { name: 'category', alias: 'c', type: String },
]
const options = commandLineArgs(optionDefinitions)

async function onFinishTorrent() {
  const telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
  const snapshot = await readSnapshot()
  if (snapshot) {
    snapshot.forEach((next) => {
      const { chatId, username } = next[1]
      logger.info(`Send message to chat/user: ${chatId}/@${username}`)
      let msg = `Torrent <b>'${options.name}'</b>`
      if (options.category) {
        msg = msg.concat(` from category <i>'${options.category}'</i>`)
      }
      msg = msg.concat(` has been downloaded.`)
      telegraf.telegram.sendMessage(chatId, msg, { parse_mode: 'HTML' })
    })
  }
}

switch (options.action) {
  case 'finish':
    onFinishTorrent()
    break
  case undefined:
    logger.error('You have to add argument --action=<action>')
    break
  default:
    logger.error(`Action '${options.action}' is not allowed.`)
}
