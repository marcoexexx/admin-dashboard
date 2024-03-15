import { authApi } from "./authApi";
import { QueryOptionArgs } from "./types";

export async function pingFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<{ ping: "PONG"; }>("/ping", {
    ...opt,
  });
  return data;
}
