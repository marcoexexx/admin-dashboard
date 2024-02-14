import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PickupAddressListTable } from ".";
import { useStore } from "@/hooks";
import { useGetPickupAddresses } from "@/hooks/pickupAddress";


export function PickupAddressList() {
  const { state: {pickupAddressFilter} } = useStore()

  const { try_data, isLoading } = useGetPickupAddresses({
    filter: pickupAddressFilter?.fields,
    pagination: {
      page: pickupAddressFilter?.page || 1,
      pageSize: pickupAddressFilter?.limit || 10
    },
    include: undefined
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

