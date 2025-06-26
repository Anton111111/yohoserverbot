import fs from 'fs'
import { getMsToHumanReadableDate } from './date';

export function caffeineModeActiveMs(): number {
  if (fs.existsSync(process.env.CAFFEINE_FILE_PATH)) {
    const threshold = Number(fs.readFileSync(process.env.CAFFEINE_FILE_PATH, 'utf8'))
    const mtime = fs.statSync(process.env.CAFFEINE_FILE_PATH).mtime
    const now = new Date()
    if (!isNaN(threshold) && threshold > 0) {
      mtime.setSeconds(mtime.getSeconds() + threshold);
      const diffMs = mtime.getTime() - now.getTime()
      return diffMs > 0 ? diffMs : 0;
    }
  }
  return 0
}

export function enableCaffeine(threshold: number) {
  fs.writeFileSync(process.env.CAFFEINE_FILE_PATH, threshold.toString(), 'utf-8')
  fs.chmodSync(process.env.CAFFEINE_FILE_PATH, 0o777)
}

export function disableCaffeine() {
  fs.unlinkSync(process.env.CAFFEINE_FILE_PATH);
}

export function getHTMLReport(): string {
  const ms = caffeineModeActiveMs()
  return ms > 0 ? `Caffeine lasts for ${getMsToHumanReadableDate(ms)}` : ''
}


