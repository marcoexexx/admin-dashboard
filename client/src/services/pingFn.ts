import { QueryOptionArgs } from "./types"
import { authApi } from "./authApi"


export async function pingFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<{ ping: "PONG" }>("/ping", {
    ...opt,
  })
  return data
}

