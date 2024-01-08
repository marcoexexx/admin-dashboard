import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { MuiButton } from '@/components/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { CityFees } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks';
import filter from 'lodash/filter';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { getCitiesFn } from '@/services/citiesApi';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface CityMultiInputFieldProps {
  updateField?: boolean
}

export function CityMultiInputField({updateField = false}: CityMultiInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ cities: string[] }>()
  const [ selectedCities, setSelectedCities ] = useState<Pick<CityFees, "id" | "city">[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: cities,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["cities"],
    queryFn: args => getCitiesFn(args, { 
      filter: {},
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      }
    }),
    select: data => data.results
  })

  const defaultCityIds = getValues("cities")
  const defaultCities = defaultCityIds
    ? filter(cities, (city) => defaultCityIds.includes(city.id))
    : []


  useEffect(() => {
    if (defaultCities.length && updateField) setSelectedCities(defaultCities)
  }, [defaultCities.length])


  const handleCategoryChange = (_: React.SyntheticEvent, value: Pick<CityFees, "id" | "city">[] | null) => {
    if (value) {
      setSelectedCities(value)
      setValue("cities", value.map(v => v.id))
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "cities" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed city autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />

  return <>
    <Controller
      name="cities"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedCities}
          options={cities || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.city || ""}
          loading={isLoading}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option.city}
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
            error={!!errors.cities}
            helperText={errors.cities?.message || ""}
            label="Cities"
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


