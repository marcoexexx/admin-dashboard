import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks';
import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiButton } from '@/components/ui';
import { Region } from '@/services/types';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { getRegionsFn } from '@/services/regionsApi';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface RegionInputFieldProps {
  updateField?: boolean
}

export function RegionInputField({updateField = false}: RegionInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ regionId: string }>()
  const [ selectedRegion, setSelectedRegion ] = useState<Region|null>(null)
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: regions,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["regions"],
    queryFn: args => getRegionsFn(args, {
      filter: {},
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      }
    }),
    select: data => data.results
  })

  const defaultRegionId = getValues("regionId")
  const defaultRegion = defaultRegionId
    ? regions?.find(region => region.id === defaultRegionId)
    : undefined

  useEffect(() => {
    if (defaultRegion && updateField) setSelectedRegion(defaultRegion)
  }, [defaultRegion])


  const handleRegionChange = (_: React.SyntheticEvent, value: Region | null) => {
    if (value) {
      setSelectedRegion(value)
      setValue("regionId", value.id)
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "region" })
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
      name="regionId"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          value={selectedRegion}
          options={regions || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.name || ""}
          loading={isLoading}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option.name}
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
            error={!!errors.regionId}
            helperText={errors.regionId?.message || ""}
            label="Region"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleRegionChange}
        />
      )}
    />
  </>
}

