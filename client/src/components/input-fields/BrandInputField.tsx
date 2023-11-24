import { useState } from 'react';
import { getBrandsFn } from '@/services/brandsApi';
import { Autocomplete, Paper, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiButton } from '@/components/ui';
import { CreateBrandForm, FormModal } from '@/components/forms';
import { useStore } from '@/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

export function BrandInputField() {
  const { control, setValue, formState: { errors } } = useFormContext<{ brandId: string }>()
  const [ selectedBrand, setSelectedBrand ] = useState<IBrand|null>(null)
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

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

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "brands" })
  }

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

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

  return <>
    <Controller
      name="brandId"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          value={selectedBrand}
          options={brands || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.name || ""}
          loading={isLoading}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option.name}
            </li>
          )}
          PaperComponent={({children}) => <Paper>
            {children}
            <MuiButton
              fullWidth
              startIcon={<AddTwoToneIcon />}
              variant='text'
              component="label"
              onClick={handleOnClickCreateNew}
            >
              Create new
            </MuiButton>
          </Paper>}
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

    <FormModal field='brands' title='Create new brand' onClose={handleOnCloseModalForm}>
      <CreateBrandForm />
    </FormModal>
  </>
}
