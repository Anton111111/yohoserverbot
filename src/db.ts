import { Level } from 'level'

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

export default db
