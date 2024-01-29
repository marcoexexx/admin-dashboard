import { SuspenseLoader } from '.';
import { useCookies } from 'react-cookie'
import { usePermission, useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMeFn } from '@/services/authApi';
import { getDashboardPermissionsFn } from '@/services/permissionsApi';

import AppError, { AppErrorKind } from '@/libs/exceptions';


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
    enabled: !!cookies.logged_in,
    key: "dashboard-permissions",
    queryFn: getDashboardPermissionsFn,
    actions: "read",
  })


  if (isLoading) return <SuspenseLoader />

  if (isError && error) throw AppError.new(AppErrorKind.ApiError, error.message)

  if (cookies.logged_in && !isAllowedReactDashboard) throw AppError.new(AppErrorKind.PermissionError)

  return children
}
