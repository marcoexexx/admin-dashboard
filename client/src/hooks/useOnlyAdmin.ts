import { useStore } from "@/hooks"

export function useOnlyAdmin() {
  const { state: {user} } = useStore()

  const role = user?.role || "*"
  if (role === "Admin") return true
  return false
}
