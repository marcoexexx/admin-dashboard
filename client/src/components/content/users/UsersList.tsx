import { Card } from "@mui/material";
import { useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getUsersFn } from "@/services/usersApi";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";

export function UsersList() {
  const { state: {userFilter} } = useStore()

  const { data: me, isError: isMeError, isLoading: isMeLoading, error: meError } = useQuery({
    queryKey: ["authUser"],
    select: (data: UserResponse) => data.user,
  })

  const { data: users, isError: isUsersError, isLoading: isUsersLoading, error: usersError } = useQuery({
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


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if ((!users || !me) || isLoading) return <SuspenseLoader />

  return <Card>
    <UsersListTable
      me={me}
      users={users.results} 
      count={users.count} 
    />
  </Card>
}
