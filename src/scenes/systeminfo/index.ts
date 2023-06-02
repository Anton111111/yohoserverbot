import { exec } from "child_process"
import { Scenes } from "telegraf"
import axios from "axios"
import { delay } from "../../util/async"
import { kill } from "process"
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
    const p = exec("glances -t=1 --quiet -w --disable-webui >/dev/null")
    let cpuInfo: CPUInfo
    let memInfo: MemInfo
    let sensorsInfo: MemInfo
    while (!cpuInfo) {
        await delay(1000)
        try {
            let response = await axios.get("http://127.0.0.1:61208/api/3/cpu")
            cpuInfo = response.data as CPUInfo
            response = await axios.get("http://127.0.0.1:61208/api/3/mem")
            memInfo = response.data as MemInfo
            response = await axios.get("http://127.0.0.1:61208/api/3/sensors")
            sensorsInfo = response.data
        } catch (e) {

        }
    }
    // Dirty trick +1 because exec return shell script that start glances 
    try {
        p.kill()
        kill(p.pid + 1)
    } catch (e) { }

    let sensorsStr = ""
    if (Object.entries(sensorsInfo).length > 0) {
        sensorsStr = "<b>Sensors:</b>\n"
        Object.entries(sensorsInfo).forEach(([key, value], index) => {
            sensorsStr.concat(`${key}:<i>value</i>\n`)
        })
    }

    const memInfoStr = `<b>MemInfo:</b> <i>${memInfo.percent}%</i> (free: <i>${humanFileSize(memInfo.free)}</i> from: <i>${humanFileSize(memInfo.total)}</i>)\n`
    const cpuInfoStr = `<b>CPUInfo:</b> <i>${cpuInfo.total}%</i>\n`
    ctx.replyWithHTML(cpuInfoStr+memInfoStr+sensorsStr)
})

export default systemInfoScene