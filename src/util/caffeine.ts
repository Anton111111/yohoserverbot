import fs from 'fs'

export function isCaffeineModeEnabled(): boolean {
  return fs.existsSync(process.env.CAFFEINE_FILE_PATH)
}

export function enableCaffeine() {
  fs.writeFileSync(process.env.CAFFEINE_FILE_PATH, 'caffeine', 'utf-8');
}

export function disableCaffeine() {
  fs.unlinkSync(process.env.CAFFEINE_FILE_PATH);
}

export function getHTMLReport(): string {
  return isCaffeineModeEnabled() ? 'Caffeine mode enabled' : ''
}
