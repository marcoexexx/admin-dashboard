import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { RenderToggleBlockUserButton, RenderUsernameLabel } from "@/components/table-labels";
import { Resource, User } from "@/services/types";
import { UsersFilterForm } from ".";
import { EnhancedTable, TypedColumn } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<User>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value, me }) => me ? <RenderUsernameLabel user={value} me={me} /> : null
  },
  {
    id: "email",
    align: "right",
    name: "Email",
    render: ({ value }) => <Typography>{value.email}</Typography>
  },
  {
    id: "role",
    align: "right",
    name: "Role",
    render: ({ value }) => <Typography>{value.role?.name}</Typography>
  },
  {
    id: "shopownerProvider",
    align: "right",
    name: "Shopowner",
    render: ({ value }) => <Typography>{value.shopownerProvider?.name}</Typography>
  },
  {
    id: "blockedUsers",
    align: "right",
    name: "Blocked",
    render: ({ value, me }) => me ? <RenderToggleBlockUserButton user={value} me={me} /> : null
  }
]


interface UsersListTableProps {
  users: User[]
  count: number
  isLoading?: boolean
  onDelete?: (id: string) => void
  onMultiDelete?: (ids: string[]) => void
  onCreateMany?: (buf: ArrayBuffer) => void
}

export function UsersListTable(props: UsersListTableProps) {
  const { users, count, isLoading, onDelete, onMultiDelete, onCreateMany } = props
  const { state: { brandFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_USER_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_USER_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }


  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.User]}
        renderFilterForm={<UsersFilterForm />}
        rows={users}
        resource={Resource.User}
        isLoading={isLoading}
        columns={columns}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
        onMultiCreate={onCreateMany}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={pagination?.page
            ? pagination.page - 1
            : 0}
          rowsPerPage={pagination?.pageSize || INITIAL_PAGINATION.pageSize}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}
