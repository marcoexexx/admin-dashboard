import { useCookies } from 'react-cookie'
import { useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMeFn } from '@/services/authApi';
import { SuspenseLoader } from '.';

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { dispatch } = useStore()
  const [cookies] = useCookies(["logged_in"])

  const query = useQuery({
    enabled: !!cookies.logged_in,
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user,
  })

  useEffect(() => {
    dispatch({ type: "SET_USER", payload: query.data })
  }, [query.isSuccess])

  if (query.isLoading) return <SuspenseLoader />

  // if (query.isError) throw new Error(query.error)
  if (query.isError) return <h1>Env: {import.meta.env.MODE} Change Error: {query.error.message}</h1>

  return children
}
