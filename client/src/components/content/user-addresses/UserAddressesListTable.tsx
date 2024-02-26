import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { Address, Resource } from "@/services/types";
import { UserAddressesFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<Address>[] = [
  {
    id: "username",
    align: "left",
    name: "Username",
    render: ({ value }) => <Typography>{value.username}</Typography>
  },
  {
    id: "phone",
    align: "left",
    name: "Phone",
    render: ({ value }) => <Typography>{value.phone}</Typography>
  },
  {
    id: "email",
    align: "left",
    name: "Email",
    render: ({ value }) => <Typography>{value.email}</Typography>
  },
  {
    id: "fullAddress",
    align: "left",
    name: "Full address",
    render: ({ value }) => <Typography>{value.fullAddress}</Typography>
  },
  {
    id: "isDefault",
    align: "right",
    name: "Is default",
    render: ({ value }) => <Typography>{value.isDefault ? "default" : null}</Typography>
  },
]


interface UserAddressesListTableProps {
  userAddresses: Address[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
}

export function UserAddressesListTable(props: UserAddressesListTableProps) {
  const { userAddresses, count, isLoading, onDelete, onMultiDelete } = props
  const { state: { userAddressFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_USER_ADDRESS_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_USER_ADDRESS_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.UserAddress]}
        renderFilterForm={<UserAddressesFilterForm />}
        rows={userAddresses}
        resource={Resource.UserAddress}
        isLoading={isLoading}
        columns={columns}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
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
