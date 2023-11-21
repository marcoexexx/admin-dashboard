export interface Authoritor<R> {
  isAuthenticated(permission: Permission<R>, role: R, action: Action): boolean
}

export interface Permission<R> {
  // it only allowed to use `*` when return
  createAllowedRoles(): Array<R | "*">,
  readAllowedRoles(): Array<R | "*">,
  updateAllowedRoles(): Array<R | "*">,
  deleteAllowedRoles(): Array<R | "*">,
}

export type Action = "create" | "read" | "update" | "delete"
