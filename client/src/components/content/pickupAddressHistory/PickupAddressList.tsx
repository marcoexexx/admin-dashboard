import { useQuery } from "@tanstack/react-query";
import { getMeProfileFn } from "@/services/authApi";
import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PickupAddressListTable } from ".";


export function PickupAddressList() {
  const { 
    data, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["authUserProfile"],
    queryFn: getMeProfileFn,
    select: data => data.user,
  })

  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (isLoading) return <SuspenseLoader />


  return <Card>
    <PickupAddressListTable
      isLoading={isLoading}
      pickupAddresses={data?.pickupAddresses || []} 
      count={data?.pickupAddresses?.length || 0} 
    />
  </Card>
}

