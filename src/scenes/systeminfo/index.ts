import { exec } from "child_process"
import { Scenes } from "telegraf"
import logger from "../../util/logger"
import axios from "axios"
import { delay } from "../../util/async"
import { kill, pid } from "process"
import { bold, fmt } from "telegraf/format"
import { humanFileSize } from "../../util/formating"

interface CPUInfo {
    total: number
}

interface MemInfo {
    total: number
    available: number
    free: number
    percent: number
}

const systemInfoScene = new Scenes.BaseScene<Scenes.SceneContext>("systeminfo")
systemInfoScene.enter(async ctx => {
    ctx.reply("Start fetching....")
    const p = exec('glances -t=1 --quiet -w --disable-webui >/dev/null')
    let cpuInfo: CPUInfo
    let memInfo: MemInfo
    while (!cpuInfo) {
        await delay(1000)
        try {
            let response = await axios.get('http://127.0.0.1:61208/api/3/cpu')
            cpuInfo = response.data as CPUInfo
            response = await axios.get('http://127.0.0.1:61208/api/3/mem')
            memInfo = response.data as MemInfo
        } catch (e) {

        }
    }
    // Dirty trick +1 because exec return shell script that start glances 
    try {
        p.kill()
        kill(p.pid + 1)
    } catch (e) { }
    ctx.reply(
        fmt`${bold`MemInfo:`} ${memInfo.percent}% (free: ${humanFileSize(memInfo.free)} from ${humanFileSize(memInfo.total)})
${bold`CPUInfo:`} ${cpuInfo.total}%
`)

})

export default systemInfoScene