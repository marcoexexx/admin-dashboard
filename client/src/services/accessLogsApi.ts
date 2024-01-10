import { authApi } from "./authApi";
import { AccessLog, HttpListResponse, QueryOptionArgs } from "./types";


export async function getAccessLogsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<HttpListResponse<AccessLog>>("/access-logs", {
    ...opt,
  })
  return data
}
