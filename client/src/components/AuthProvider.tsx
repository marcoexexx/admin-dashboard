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
  const [cookies, setCookies] = useCookies(["logged_in"])

  const userQuery = useMe({
    enabled: !!cookies.logged_in,
  })

  const user = userQuery.try_data.ok_or_throw()


  useEffect(() => {
    if (userQuery.isError) setCookies("logged_in", false)
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
