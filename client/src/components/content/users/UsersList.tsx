import { Card } from "@mui/material";
import { useStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getUsersFn } from "@/services/usersApi";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";

export function UsersList() {
  const { state: {userFilter} } = useStore()

  const { data, isError, isLoading, error } = useQuery({
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


  if (!data && isError || error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  return <Card>
    <UsersListTable
      users={data.results} 
      count={data.count} 
    />
  </Card>
}
