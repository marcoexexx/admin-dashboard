import { LoginUserInput, RegisterUserInput } from "@/components/forms/auth";
import getConfig from "@/libs/getConfig";
import axios from "axios";

const BASE_URL = getConfig("backendEndpoint")

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

authApi.defaults.headers.common["Content-Type"] = "application/json"

export async function refreshAccessTokenFn() {
  const res = await authApi.get<LoginResponse>("auth/refresh");
  return res.data
}

authApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const res = err.response;
    const orgReq = err.config;

    if (!res) return Promise.reject(new Error(err.message))

    const msg = res.data.message as string;

    if (msg.includes("not logged in") && !orgReq._retry) {
      orgReq._retry = true;
      await refreshAccessTokenFn();
      return authApi(orgReq)
    }
    if (err.response.data.message.includes("not refresh")) {
      document.location.href = "/auth/login"
    }
    return Promise.reject(err)
  }
)

export async function getMeFn() {
  const res = await authApi.get<UserResponse>("me");
  return res.data
}

export async function getMeProfileFn() {
  const res = await authApi.get<UserProfileResponse>("me/profile");
  return res.data
}

export async function logoutUserFn() {
  const res = await authApi.post<HttpResponse>("auth/logout")
  return res.data
}


export async function registerUserFn(user: RegisterUserInput) {
  const res = await authApi.post<UserResponse>("auth/register", user)
  return res.data
}


export async function loginUserFn(user: LoginUserInput) {
  const res = await authApi.post<UserResponse>("auth/login", user)
  return res.data
}


export async function verifyEmailFn(opt: QueryOptionArgs, verificationCode: string | undefined) {
  if (!verificationCode) return
  const res = await authApi.get<HttpResponse>(`auth/verifyEmail/${verificationCode}`, opt);
  return res.data
}
