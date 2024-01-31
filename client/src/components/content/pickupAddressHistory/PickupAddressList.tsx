import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PickupAddressListTable } from ".";
import { useMe } from "@/hooks";


export function PickupAddressList() {
  const userQuery = useMe({
    include: {
      pickupAddresses: true
    }
  })

  const user = userQuery.try_data.ok_or_throw()
  const isLoading = userQuery.isLoading

  if (isLoading) return <SuspenseLoader />


  return <Card>
    <PickupAddressListTable
      isLoading={isLoading}
      pickupAddresses={user?.pickupAddresses || []} 
      count={user?.pickupAddresses?.length || 0} 
    />
  </Card>
}

