import { Context } from 'telegraf'
import Winston, { format } from 'winston'

/**
 * Adds user id and nickname if found. Also formats message to display complex objects
 * @param ctx - telegram context
 * @param msg  - message
 * @param _data - object to log
 */
function prepareMessage(ctx: Context, msg: string) {
  if (ctx && ctx.from) {
    return `[${ctx.from.id}/${ctx.from.username}]: ${msg}`
  }

  return `: ${msg}`
}

const { combine, timestamp, printf } = format
const logFormat = printf((info) => {
  const color = (() => {
    let c
    switch (info.level) {
      case 'info': c = '\x1b[36m'
        break
      case 'debug': c = '\x1b[90m'
        break
      case 'error': c = '\x1b[31m'
        break
      case 'warn': c = '\x1b[33m'
        break
      case 'verbose': c = '\x1b[34m'
        break
      default: c = '\x1b[90m'
    }
    return c
  })()
  return `[${info.timestamp}] [${color}${info.level}\x1b[0m] - ${info.message}`
})

const logger = Winston.createLogger({
  transports: [
    new Winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
  ],
  format: combine(timestamp(), format.splat(), format.simple(), logFormat),
})

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level')
}

export const loggerWithCtx = {
  debug: (ctx: Context, msg: string) => logger.debug(
    prepareMessage(ctx, msg),
  ),
  error: (ctx: Context, msg: string) => logger.error(
    prepareMessage(ctx, msg),
  ),
}

export default logger
