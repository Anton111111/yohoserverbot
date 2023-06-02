import { exec } from "child_process"
import { Scenes } from "telegraf"
import axios from "axios"
import { delay } from "../../util/async"
import { kill } from "process"
import { humanFileSize } from "../../util/formating"

interface CPUInfo {
    total: number
    idle: number
    system: number
    user: number
}

interface MemInfo {
    total: number
    available: number
    free: number
    percent: number
}

interface SensorsInfo {
    label: string
    value: number
    unit: string
    type: string
    key: string
}

const systemInfoScene = new Scenes.BaseScene<Scenes.SceneContext>("systeminfo")
systemInfoScene.enter(async ctx => {
    ctx.reply("Start fetching....")
    const p = exec("glances -t=1 --quiet -w --disable-webui >/dev/null")
    let cpuInfo: CPUInfo
    let memInfo: MemInfo
    let sensorsInfos: Array<SensorsInfo> = []
    await delay(2000) // Delay to give time to calm down after the launch
    while (!cpuInfo) {
        await delay(1000)
        try {
            let response = await axios.get("http://127.0.0.1:61208/api/3/cpu")
            cpuInfo = response.data as CPUInfo
            response = await axios.get("http://127.0.0.1:61208/api/3/mem")
            memInfo = response.data as MemInfo
            response = await axios.get("http://127.0.0.1:61208/api/3/sensors")
            sensorsInfos = response.data as Array<SensorsInfo>
        } catch (e) { }
    }
    // Dirty trick +1 because exec return shell script that start glances 
    try {
        p.kill()
        kill(p.pid + 1)
    } catch (e) { }

    let sensorsStr = ""
    if (sensorsInfos.length > 0) {
        sensorsStr = "<b>Sensors:</b>\n"
        sensorsInfos.forEach((sensorInfo) => {
            sensorsStr = sensorsStr.concat(`${sensorInfo.label}: <i>${sensorInfo.value} ${sensorInfo.unit}</i>\n`)
        })
    }

    const memInfoStr = `<b>MemInfo:</b> <i>${memInfo.percent}%</i> (free: <i>${humanFileSize(memInfo.free)}</i> from: <i>${humanFileSize(memInfo.total)}</i>)\n`
    const cpuInfoStr = `<b>CPUInfo:</b> <i>${cpuInfo.total}%</i> (user: <i>${cpuInfo.user}%</i> system: <i>${cpuInfo.system}%</i> idle: <i>${cpuInfo.idle}%</i>)\n`
    ctx.replyWithHTML(cpuInfoStr + memInfoStr + sensorsStr)
})

export default systemInfoScene