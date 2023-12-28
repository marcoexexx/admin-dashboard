import { getMeFn } from "@/services/authApi";
import { useQuery } from "@tanstack/react-query"
import { Role } from "@/services/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";


interface PermissionProps {
  allowedRoles: Role[]
}

export function PagePermission(props: PermissionProps) {
  const { allowedRoles } = props;
  const location = useLocation();

  const {
    isLoading,
    isFetching,
    data: user
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    retry: 1,
    select: (data) => data.user,
  })

  const loading = isLoading || isFetching;

  if (loading) return <h1>Full Loading</h1>

  return user && allowedRoles.includes(user.role) 
    ? <Outlet /> 
    : user
    ? <Navigate to="/status/unauthorized" state={{ from: location }} replace />
    : <Navigate to="/auth/login" state={{ from: location }} replace />
}
