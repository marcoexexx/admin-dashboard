export function useOnlyAdmin(user: IUser | undefined) {
  const role = user?.role || "User"
  if (role === "Admin") return true
  return false
}
