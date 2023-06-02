import { Level } from 'level'

type User = {
  id: number,
  username?: string
}

const db = new Level<number, User>('db', { valueEncoding: 'json' })

export async function getOrNull(key: number): Promise<User | null> {
  try {
    return await db.get(key)
  } catch (e) {
    return null
  }
}

export default db
