import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useGetUsers } from "@/hooks/user";
import { Card } from "@mui/material";
import { UsersListTable } from ".";

export function UsersList() {
  const { state: { userFilter } } = useStore();

  const usersQuery = useGetUsers({
    filter: userFilter.where,
    pagination: userFilter.pagination || INITIAL_PAGINATION,
    include: {
      blockedUsers: true,
    },
  });

  const users = usersQuery.try_data.ok_or_throw();

  return (
    <Card>
      <UsersListTable
        users={users?.results ?? []}
        count={users?.count ?? 0}
      />
    </Card>
  );
}
