import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PickupAddressListTable } from ".";
import { useStore } from "@/hooks";
import { useGetPickupAddresses } from "@/hooks/pickupAddress";
import { INITIAL_PAGINATION } from "@/context/store";


export function PickupAddressList() {
  const { state: { pickupAddressFilter } } = useStore()

  const { try_data, isLoading } = useGetPickupAddresses({
    filter: pickupAddressFilter.where,
    pagination: pickupAddressFilter.pagination || INITIAL_PAGINATION,
  })

  const pickupAddresses = try_data.ok_or_throw()?.results

  if (isLoading) return <SuspenseLoader />


  return <Card>
    <PickupAddressListTable
      isLoading={isLoading}
      pickupAddresses={pickupAddresses || []}
      count={pickupAddresses?.length || 0}
    />
  </Card>
}

