import { getBrandsFn } from '@/services/brandsApi';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

export function BrandInputField() {
  const { control, setValue, formState: { errors } } = useFormContext<{ brandId: string }>()
  const [ selectedBrand, setSelectedBrand ] = useState<IBrand|null>(null)

  const {
    data: brands,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["brands"],
    queryFn: args => getBrandsFn(args, { filter: {} }),
    select: data => data.results
  })

  const handleBrandChange = (_: React.SyntheticEvent, value: IBrand | null) => {
    if (value) {
      setSelectedBrand(value)
      setValue("brandId", value.id)
    }
  }

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed brand autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />

  return <Controller
    name="brandId"
    control={control}
    render={({field}) => (
      <Autocomplete
        {...field}
        value={selectedBrand}
        options={brands || []}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name || ""}
        loading={isLoading}
        renderInput={params => <TextField
          {...params}
          error={!!errors.brandId}
          helperText={errors.brandId?.message || ""}
          label="Brand"
          InputProps={{
            ...params.InputProps,
            endAdornment: <>
              {isLoading && <CircularProgress color='primary' size={20} />}
              {params.InputProps.endAdornment}
            </>
          }}
        />}
        onChange={handleBrandChange}
      />
    )}
  />
}
