import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks';
import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiButton } from '@/components/ui';
import { TownshipFees } from '@/services/types';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { getTownshipsFn } from '@/services/TownshipsApi';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface TownshipByRegionInputFieldProps {
  updateField?: boolean
}

export function TownshipByRegionInputField({updateField = false}: TownshipByRegionInputFieldProps) {
  const { control, setValue, getValues, formState: { errors }, watch } = useFormContext<{ regionId: string, townshipFeesId: string }>()
  const [ selectedTownship, setSelectedTownship ] = useState<TownshipFees|null>(null)
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const regionId = watch("regionId")

  const { dispatch } = useStore()

  const {
    data: townships,
    isLoading,
    isError,
    error
  } = useQuery({
    enabled: !!regionId,
    queryKey: ["townships", { regionId }],
    queryFn: args => getTownshipsFn(args, {
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      },
      filter: {
        region: {
          id: {
            equals: regionId
          }
        }
      }
    }),
    select: data => data.results
  })

  const defaultTownshipId = getValues("townshipFeesId")
  const defaultTownship = defaultTownshipId
    ? townships?.find(township => township.id === defaultTownshipId)
    : undefined

  useEffect(() => {
    if (defaultTownship && updateField) setSelectedTownship(defaultTownship)
  }, [defaultTownship])


  const handleTownshipChange = (_: React.SyntheticEvent, value: TownshipFees | null) => {
    if (value) {
      setSelectedTownship(value)
      setValue("townshipFeesId", value.id)
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "townships" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed township autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />


  return <>
    <Controller
      disabled={!regionId}
      name="townshipFeesId"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          value={selectedTownship}
          options={townships || []}
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
            label="Township"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleTownshipChange}
        />
      )}
    />
  </>
}


