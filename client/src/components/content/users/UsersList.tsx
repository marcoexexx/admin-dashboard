import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";
import { useCombineQuerys, useMe, useStore } from "@/hooks";
import { useGetUsers } from "@/hooks/user";


export function UsersList() {
  const { state: {userFilter} } = useStore()

  const meQuery = useMe({})
  const usersQuery = useGetUsers({
    filter: userFilter?.fields,
    pagination: {
      page: userFilter?.page || 1,
      pageSize: userFilter?.limit || 10
    },
    include: {
      blockedUsers: true,
    }
  })

  const me = meQuery.try_data.ok_or_throw()
  const users = usersQuery.try_data.ok_or_throw()

  const { isLoading } = useCombineQuerys(
    meQuery,
    usersQuery
  )

  if ((!users || !me) || isLoading) return <SuspenseLoader />

  return <Card>
    <UsersListTable
      me={me}
      users={users.results} 
      count={users.count} 
    />
  </Card>
}
