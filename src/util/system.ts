import { exec } from 'child_process'

export default function suspend() {
  exec('systemctl suspend')
}

export function shutdown() {
  exec('shutdown now')
}
