import { Context } from "telegraf"
import Winston, { format } from "winston"

/**
 * Adds user id and nickname if found. Also formats message to display complex objects
 * @param ctx - telegram context
 * @param msg  - message
 * @param data - object to log
 */
function prepareMessage(ctx: Context, msg: string, ...data: any[]) {
    if (ctx && ctx.from) {
        return `[${ctx.from.id}/${ctx.from.username}]: ${msg}`
    }

    return `: ${msg}`
}

const { combine, timestamp, printf } = format
const logFormat = printf(info => {
    const color = (() => {
        switch (info.level) {
            case "info": return "\x1b[36m"
            case "debug": return "\x1b[90m"
            case "error": return "\x1b[31m"
            case "warn": return "\x1b[33m"
            case "verbose": return "\x1b[34m"
        }
    })()
    return `[${info.timestamp}] [${color}${info.level}\x1b[0m] - ${info.message}`
})

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        })
    ],
    format: combine(timestamp(), format.splat(), format.simple(), logFormat)
})

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level")
}

export const loggerWithCtx = {
    debug: (ctx: Context, msg: string, ...data: any[]) =>
        logger.debug(prepareMessage(ctx, msg, ...data)),
    error: (ctx: Context, msg: string, ...data: any[]) =>
        logger.error(prepareMessage(ctx, msg, ...data))
}

export default logger