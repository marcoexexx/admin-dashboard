import { authApi } from "./authApi";
import { UploadProfilePictureInput } from "@/components/image-uploader";
import { HttpListResponse, Pagination, QueryOptionArgs, User, UserResponse } from "./types";
import { UserFilter } from "@/context/user";


export async function getUsersFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: UserFilter["fields"], pagination: Pagination, include?: UserFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<User>>("/users", {
    ...opt,
    params: {
      filter,
      pagination,
      include
    },
  })
  return data
}


// TODO: remove :: ref: content users/UserProfile.tsx
export async function getUserProfileFn(opt: QueryOptionArgs, { username }: { username: string | undefined }) {
  if (!username) return
  const { data } = await authApi.get<UserResponse>(`/users/profile/${username}`, {
    ...opt,
  })
  return data
}


export async function getUserFn(opt: QueryOptionArgs, { userId, include }: { userId: string | undefined, include?: UserFilter["include"] }) {
  if (!userId) return
  const { data } = await authApi.get<UserResponse>(`/users/detail/${userId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createBlockUserFn({ userId, remark }: { userId: string, remark?: string }) {
  const { data } = await authApi.patch<UserResponse>(`/users/block-user`, {
    userId,
    remark
  })
  return data
}


export async function unBlockUserFn({ blockedUserId }: { blockedUserId: string }) {
  const { data } = await authApi.patch<UserResponse>(`/users/unblock-user/${blockedUserId}`)
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
