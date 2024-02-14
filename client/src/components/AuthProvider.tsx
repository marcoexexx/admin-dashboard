import { SuspenseLoader } from '.';
import { PermissionKey } from '@/context/cacheKey';
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
  const [cookies] = useCookies(["logged_in"])

  const meQuery = useMe({
    enabled: !!cookies.logged_in
  })

  const me = meQuery.try_data.ok_or_throw()
  const { isSuccess, isLoading } = meQuery


  useEffect(() => {
    if (isSuccess) dispatch({ type: "SET_USER", payload: me })
  }, [isSuccess])


  const isAllowedReactDashboard = usePermission({
    fetchUser: !!cookies.logged_in,
    key: PermissionKey.Dashboard,
    queryFn: getDashboardPermissionsFn,
    actions: "read",
  })


  if (isLoading) return <SuspenseLoader />

  if (cookies.logged_in && !isAllowedReactDashboard) throw AppError.new(AppErrorKind.PermissionError)

  return children
}
