import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { UsersListTable } from ".";
import { useStore } from "@/hooks";
import { useGetUsers } from "@/hooks/user";
import { INITIAL_PAGINATION } from "@/context/store";


export function UsersList() {
  const { state: { userFilter } } = useStore()

  const usersQuery = useGetUsers({
    filter: userFilter.where,
    pagination: userFilter.pagination || INITIAL_PAGINATION,
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
