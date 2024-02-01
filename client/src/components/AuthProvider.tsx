import { SuspenseLoader } from '.';
import { useCookies } from 'react-cookie'
import { useMe, usePermission, useStore } from "@/hooks";
import { useEffect } from "react";
import { getDashboardPermissionsFn } from '@/services/permissionsApi';

import AppError, { AppErrorKind } from '@/libs/exceptions';


interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { dispatch } = useStore()
  const [cookies, _, removeCookies] = useCookies(["logged_in", "access_token", "refresh_token"])

  const userQuery = useMe({
    enabled: !!cookies.logged_in,
  })

  const user = userQuery.try_data.ok_or_throw()


  useEffect(() => {
    if (userQuery.isError && cookies.logged_in && cookies.access_token && cookies.refresh_token) {
      removeCookies("logged_in")
      removeCookies("access_token")
      removeCookies("refresh_token")
    }
  }, [userQuery.isError])


  useEffect(() => {
    if (userQuery.isSuccess) dispatch({ type: "SET_USER", payload: user })
  }, [userQuery.isSuccess])

  const isAllowedReactDashboard = usePermission({
    enabled: !!cookies.logged_in,
    key: "dashboard-permissions",
    queryFn: getDashboardPermissionsFn,
    actions: "read",
  })


  if (userQuery.isLoading) return <SuspenseLoader />

  if (cookies.logged_in && !isAllowedReactDashboard) throw AppError.new(AppErrorKind.PermissionError)

  return children
}
