import { Card } from "@mui/material";
import { useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getUsersFn } from "@/services/usersApi";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";

export function UsersList() {
  const { state: {userFilter} } = useStore()

  const { data: me, isMeError, isMeLoading, meError } = useQuery({
    queryKey: ["authUser"],
    select: (data: IUser | undefined) => data.user,
  })

  const { data: users, isUsersError, isUsersLoading, usersError } = useQuery({
    queryKey: ["users", { filter: userFilter } ],
    queryFn: args => getUsersFn(args, { 
      filter: userFilter?.fields,
      pagination: {
        page: userFilter?.page || 1,
        pageSize: userFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const isError = isUsersError || isMeError
  const isLoading = isUsersLoading || isMeLoading
  const error = usersError || meError


  if ((!users || !me) && isError || error) return <h1>ERROR: {error.message}</h1>

  if ((!users || !me) || isLoading) return <SuspenseLoader />

  return <Card>
    <UsersListTable
      me={me}
      users={users.results} 
      count={users.count} 
    />
  </Card>
}
