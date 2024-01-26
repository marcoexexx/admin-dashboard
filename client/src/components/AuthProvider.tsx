import { SuspenseLoader } from '.';
import { useCookies } from 'react-cookie'
import { useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMeFn } from '@/services/authApi';

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

  if (isLoading) return <SuspenseLoader />

  console.error({
    environment: import.meta.env.MODE,
    error: error
  })

  // TODO: thrown
  if (isError && error) throw error

  return children
}
