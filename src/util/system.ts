import { exec } from "child_process";

export function suspend() {
    exec("systemctl suspend")
}