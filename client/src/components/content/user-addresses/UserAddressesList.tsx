import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { UserAddressesListTable } from ".";
import { useStore } from "@/hooks";
import { useDeleteMultiUserAddresses, useDeleteUserAddress, useGetUserAddresses } from "@/hooks/userAddress";
import { INITIAL_PAGINATION } from "@/context/store";


export function UserAddressesList() {
  const { state: {userAddressFilter} } = useStore()

  // Quries
  const { try_data, isLoading } = useGetUserAddresses({
    filter: userAddressFilter.where,
    pagination: userAddressFilter.pagination || INITIAL_PAGINATION,
  })

  // Mutations
  const { mutate: deleteUserAddress } = useDeleteUserAddress()
  const { mutate: deleteUserAddresses } = useDeleteMultiUserAddresses()

  // Extraction
  const userAddresses = try_data.ok_or_throw()


  if (!userAddresses || isLoading) return <SuspenseLoader />

  function handleDeleteUserAddress(id: string) {
    deleteUserAddress(id)
  }

  function handleDeleteMultiUserAddresses(ids: string[]) {
    deleteUserAddresses(ids)
  }

  return <Card>
    <UserAddressesListTable 
      isLoading={isLoading}
      userAddresses={userAddresses.results} 
      count={userAddresses.count} 
      onDelete={handleDeleteUserAddress}
      onMultiDelete={handleDeleteMultiUserAddresses}
    />
  </Card>
}
