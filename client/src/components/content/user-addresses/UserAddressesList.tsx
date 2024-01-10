import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { deleteMultiUserAddressesFn, deleteUserAddressFn, getUserAddressesFn } from "@/services/userAddressApi";
import { UserAddressesListTable } from ".";


export function UserAddressesList() {
  const { state: {brandFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["user-addresses", { filter: brandFilter } ],
    queryFn: args => getUserAddressesFn(args, { 
      filter: brandFilter?.fields,
      pagination: {
        page: brandFilter?.page || 1,
        pageSize: brandFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: deleteUserAddress
  } = useMutation({
    mutationFn: deleteUserAddressFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a user address.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["user-addresses"]
      })
    }
  })

  const {
    mutate: deleteUserAddresses
  } = useMutation({
    mutationFn: deleteMultiUserAddressesFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi brands.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["user-addresses"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleDeleteUserAddress(id: string) {
    deleteUserAddress(id)
  }

  function handleDeleteMultiUserAddresses(ids: string[]) {
    deleteUserAddresses(ids)
  }

  return <Card>
    <UserAddressesListTable 
      isLoading={isLoading}
      userAddresses={data.results} 
      count={data.count} 
      onDelete={handleDeleteUserAddress}
      onMultiDelete={handleDeleteMultiUserAddresses}
    />
  </Card>
}
