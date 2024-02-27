import { useEffect, useState } from 'react';
import { useGetUserAddresses } from '@/hooks/userAddress';
import { useStore } from '@/hooks';
import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiButton } from '@/components/ui';
import { Address } from '@/services/types';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface AddressInputFieldProps {
  updateField?: boolean
  fieldName: 
    | "deliveryAddressId"
    | "billingAddressId"
}

export function AddressInputField({updateField = false, fieldName}: AddressInputFieldProps) {
  const { control, setValue, getValues, resetField } = useFormContext()
  const [ selectedAddress, setSelectedAddress ] = useState<Address|null>(null)
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const { data, isLoading, isError, error } = useGetUserAddresses({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 100
    }
  })
  const addresses = data?.results

  useEffect(() => {
    const prevsDeliveryId = getValues("deliveryAddressId")
    const prevsBillingId = getValues("billingAddressId")
    if (fieldName === "billingAddressId") setValue("deliveryAddressId", prevsDeliveryId)
    if (fieldName === "deliveryAddressId") setValue("billingAddressId", prevsBillingId)
  }, [fieldName])


  const defaultAddressId = getValues(fieldName)
  const defaultAddress = defaultAddressId
    ? addresses?.find(address => address.id === defaultAddressId)
    : undefined

  useEffect(() => {
    if (defaultAddress && updateField) setSelectedAddress(defaultAddress)

    if (defaultAddressId && !defaultAddress) {
      resetField(fieldName)
    }
  }, [defaultAddress])


  const handleChange = (_: React.SyntheticEvent, value: Address | null) => {
    if (value) {
      setSelectedAddress(value)
      setValue(fieldName, value.id)
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-user-addresse" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed address autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />


  return <>
    <Controller
      name={fieldName}
      control={control}
      render={({field, fieldState}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          value={selectedAddress}
          options={addresses || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.fullAddress || ""}
          loading={isLoading}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option.fullAddress}
            </li>
          )}
          PaperComponent={({children}) => <InnerPaper>
            {children}
            <MuiButton
              fullWidth
              startIcon={<AddTwoToneIcon />}
              variant='outlined'
              onClick={handleOnClickCreateNew}
            >
              Create new
            </MuiButton>
          </InnerPaper>}
          renderInput={params => <TextField
            {...params}
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : ""}
            label={`Address (${fieldName})`}
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleChange}
        />
      )}
    />
  </>
}
