import { authApi } from "./authApi";
import { UploadProfilePictureInput } from "@/components/image-uploader";
import { HttpListResponse, Pagination, QueryOptionArgs, Role, User, UserResponse } from "./types";


export async function getUsersFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: Pagination }) {
  const { data } = await authApi.get<HttpListResponse<User>>("/users", {
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


export async function uploadProfilePictureFn(upload: UploadProfilePictureInput) {
  const formData = new FormData()

  formData.append("profile", upload.image[0])

  const res = await authApi.post<UserResponse>("/me/upload/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })
  return res.data
}


export async function uploadCoverPhotoFn(upload: UploadProfilePictureInput) {
  const formData = new FormData()

  formData.append("profile", upload.image[0])

  const res = await authApi.post<UserResponse>("/me/upload/cover-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })
  return res.data
}
