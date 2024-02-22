import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";
import { useStore } from "@/hooks";
import { useGetUsers } from "@/hooks/user";


export function UsersList() {
  const { state: {userFilter} } = useStore()

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

  const users = usersQuery.try_data.ok_or_throw()

  if ((!users) || usersQuery.isLoading) return <SuspenseLoader />


  return <Card>
    <UsersListTable
      users={users.results} 
      count={users.count} 
    />
  </Card>
}
