import { readFileSync, writeFileSync } from 'fs'
import { Level } from 'level'
import logger from './util/logger'

type User = {
  id: number
  username?: string
  chatId?: number
}

const db = new Level<string, User>('db', { valueEncoding: 'json' })

export function getKey(userId: number, chatId: number): string {
  return `${userId}:${chatId}`
}

export async function getOrNull(key: string): Promise<User | null> {
  try {
    return await db.get(key)
  } catch (e) {
    return null
  }
}

export async function writeSnapshot(): Promise<void> {
  try {
    const snapshot = await db.iterator().all()
    const snapshotJson = JSON.stringify(snapshot)
    writeFileSync('db/snapshot', snapshotJson)
  } catch (e) {
    logger.error(`Can't write snapshot. Cause: ${e.message}`)
  }
}

export async function readSnapshot(): Promise<[[string, User]] | null> {
  try {
    const json = readFileSync('db/snapshot').toString()
    const snapshot: [[string, User]] = JSON.parse(json)
    return snapshot
  } catch (e) {
    logger.error(`Can't read snapshot. Cause: ${e.message}`)
  }
  return null
}

export default db
