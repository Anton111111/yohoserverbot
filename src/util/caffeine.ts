import fs from 'fs'

export function isCaffeineModeEnabled(): boolean {
  return fs.existsSync(process.env.CAFFEINE_FILE_PATH)
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
