import { z } from "zod"


export const booleanStrigify = z.preprocess(x => {
  if (x === "true") return true
  if (x === "false") return false
  if (typeof x === "boolean") return x
  return false
}, z.boolean())
