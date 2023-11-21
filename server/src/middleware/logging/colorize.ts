import { memoize } from "lodash";

//             ["error",      "warn",       "debug",      "info",       "log"]
const colors = ["\x1b[1;31m", "\x1b[0;33m", "\x1b[0;34m", "\x1b[0;36m", "\x1b[1m"]

const is_unix = memoize(() => {
  return process.platform === "linux" || process.platform === "darwin";
})

export function colorize(txt: string, level: number): string {
  if (is_unix()) {
    const color = colors[level];
    const offset = "\x1b[0m";
    return `${color}${txt}${offset}`
  }
  return String(txt)
}
