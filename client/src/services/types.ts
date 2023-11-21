type Role =
  | "Admin"
  | "User"
  | "Employee"
  | "*"


type UserProvider =
  | "Local"
  | "Google"
  | "Facebook"

interface IUser {
  id: string,
  name: string,
  email: string,
  password: string,
  role: Role,
  image?: string,
  verified: boolean,
  provider: UserProvider,
  createdAt: string | Date
  updatedAt: string | Date
}


interface ISettings {
  theme: 
    | "light" 
    | "dark",
  local:
    | "my"
    | "en"
}


type HttpResponse = {
  status: number,
  error?: string | string[],
  message: string
}

type HttpListResponse<T> = {
  status: number,
  results: Array<T>,
  count: number,
  error?: string | string[],
}

type PermissionsResponse = { 
  status: number, 
  permissions: {
    createAllowedRoles: Role[],
    readAllowedRoles: Role[],
    updateAllowedRoles: Role[],
    deleteAllowedRoles: Role[]
  }
}


type LoginResponse = Omit<HttpResponse, "message"> & {accessToken: string};

type UserResponse = Omit<HttpResponse, "message"> & {user: IUser};
