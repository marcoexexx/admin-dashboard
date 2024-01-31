import { Role } from "@/services/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SuspenseLoader } from ".";
import { useMe } from "@/hooks";


interface PermissionProps {
  allowedRoles: Role[]
}

export function PagePermission(props: PermissionProps) {
  const { allowedRoles } = props;
  const location = useLocation();

  const userQuery = useMe({})

  const user = userQuery.try_data.ok_or_throw()


  if (userQuery.isLoading) return <SuspenseLoader />


  return user && allowedRoles.includes(user.role) 
    ? <Outlet /> 
    : user
    ? <Navigate to="/status/unauthorized" state={{ from: location }} replace />
    : <Navigate to="/auth/login" state={{ from: location }} replace />
}
