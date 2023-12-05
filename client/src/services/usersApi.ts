import { authApi } from "./authApi";


export async function getUsersFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IUser>>("/users", {
    ...opt,
    params: {
      filter,
      pagination
    },
  })
  return data
}


export async function getUserProfileFn(opt: QueryOptionArgs, { username }: { username: string | undefined }) {
  if (!username) return
  const { data } = await authApi.get<UserResponse>(`/users/profile/${username}`, {
    ...opt,
  })
  return data
}


export async function getUserFn(opt: QueryOptionArgs, { userId }: { userId: string | undefined }) {
  if (!userId) return
  const { data } = await authApi.get<UserResponse>(`/users/detail/${userId}`, {
    ...opt,
  })
  return data
}


export async function changeRoleUserFn({ userId, role }: { userId: string, role: Omit<Role, "*"> }) {
  const { data } = await authApi.patch<UserResponse>(`/users/change-role/${userId}`, { role })
  return data
}
