import fs from 'fs'

export function isCaffeineModeEnabled(): boolean {
  if (fs.existsSync(process.env.CAFFEINE_FILE_PATH)) {
    const threshold = Number(fs.readFileSync(process.env.CAFFEINE_FILE_PATH, 'utf8'))
    return !isNaN(threshold) && threshold > 0
  }
  return false
}

export function enableCaffeine(threshold: number) {
  fs.writeFileSync(process.env.CAFFEINE_FILE_PATH, threshold.toString(), 'utf-8')
  fs.chmodSync(process.env.CAFFEINE_FILE_PATH, 0o777)
}

export function disableCaffeine() {
  fs.unlinkSync(process.env.CAFFEINE_FILE_PATH);
}

export function getHTMLReport(): string {
  return isCaffeineModeEnabled() ? 'Caffeine mode enabled' : ''
}
