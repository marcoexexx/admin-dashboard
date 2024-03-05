import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PickupAddressListTable } from ".";
import { useStore } from "@/hooks";
import { useDeletePickupAddress, useGetPickupAddresses } from "@/hooks/pickupAddress";
import { INITIAL_PAGINATION } from "@/context/store";


export function PickupAddressList() {
  const { state: { pickupAddressFilter } } = useStore()

  const { try_data, isLoading } = useGetPickupAddresses({
    filter: pickupAddressFilter.where,
    pagination: pickupAddressFilter.pagination || INITIAL_PAGINATION,
  })
  const { mutate: deletePickupAddress } = useDeletePickupAddress()

  const pickupAddresses = try_data.ok_or_throw()?.results

  function handleDeletePickupAddress(id: string) {
    deletePickupAddress(id)
  }

  if (isLoading) return <SuspenseLoader />


  return <Card>
    <PickupAddressListTable
      isLoading={isLoading}
      pickupAddresses={pickupAddresses || []}
      count={pickupAddresses?.length || 0}
      onDelete={handleDeletePickupAddress}
    />
  </Card>
}

