import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { MuiButton } from '@/components/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { TownshipFees } from '@/services/types';
import { useEffect, useState } from 'react';
import { useGetTownships } from '@/hooks/township';
import { useStore } from '@/hooks';

import filter from 'lodash/filter';
import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface TownshipMultiInputFieldProps {
  updateField?: boolean
}

export function TownshipMultiInputField({updateField = false}: TownshipMultiInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ townships: string[] }>()
  const [ selectedTownships, setSelectedTownships ] = useState<Pick<TownshipFees, "id" | "name">[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    try_data,
    isLoading,
    isError,
    error
  } = useGetTownships({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 1000
    }
  })
  const townships = try_data.ok()?.results

  const defaultTownshipIds = getValues("townships")
  const defaultTownships = defaultTownshipIds
    ? filter(townships, (township) => defaultTownshipIds.includes(township.id))
    : []


  useEffect(() => {
    if (defaultTownships.length && updateField) setSelectedTownships(defaultTownships)
  }, [defaultTownships.length])


  const handleCategoryChange = (_: React.SyntheticEvent, value: Pick<TownshipFees, "id" | "name">[] | null) => {
    if (value) {
      setSelectedTownships(value)
      setValue("townships", value.map(v => v.id))
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-township" })
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
      name="townships"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedTownships}
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
              variant="outlined"
              onClick={handleOnClickCreateNew}
            >
              Create new
            </MuiButton>
          </InnerPaper>}
          renderInput={params => <TextField
            {...params}
            error={!!errors.townships}
            helperText={errors.townships?.message || ""}
            label="Townships"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleCategoryChange}
        />
      )}
    />
  </>
}


