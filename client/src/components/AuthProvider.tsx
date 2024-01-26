import { SuspenseLoader } from '.';
import { useCookies } from 'react-cookie'
import { usePermission, useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMeFn } from '@/services/authApi';
import { AppError } from '@/libs/exceptions';
import { getDashboardPermissionsFn } from '@/services/permissionsApi';


interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { dispatch } = useStore()
  const [cookies] = useCookies(["logged_in"])

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    enabled: !!cookies.logged_in,
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user,
  })

  useEffect(() => {
    dispatch({ type: "SET_USER", payload: data })
  }, [isSuccess])

  const isAllowedReactDashboard = usePermission({
    key: "dashboard-permissions",
    queryFn: getDashboardPermissionsFn,
    actions: "read",
  })

  if (isLoading) return <SuspenseLoader />

  if (isError && error) throw AppError.ApiError(error.message, (error as any)?.response?.data?.status || 500)

  // TODO: User permission throw
  console.log({ isSuccess, isAllowedReactDashboard, isError })

  return children
}
