import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { getSalesCategoriesFn } from '@/services/salesCategoryApi';

export function SalesCategoryMultiInputField() {
  const { control, setValue, formState: { errors } } = useFormContext<{ salesCategory: string[] }>()
  const [ selectedCategories, setSelectedCategories ] = useState<Pick<ISalesCategory, "id" | "name">[]>([])

  const {
    data: salesCategory,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["salesCategory"],
    queryFn: args => getSalesCategoriesFn(args, { filter: {} }),
    select: data => data.results
  })

  const handleBrandChange = (_: React.SyntheticEvent, value: Pick<ISalesCategory, "id" | "name">[] | null) => {
    if (value) {
      console.log(value)
      setSelectedCategories(value)
      setValue("salesCategory", value.map(v => v.id))
    }
  }

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed sales category autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />

  return <Controller
    name="salesCategory"
    control={control}
    render={({field}) => (
      <Autocomplete
        {...field}
        multiple
        value={selectedCategories}
        options={salesCategory || []}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name || ""}
        loading={isLoading}
        renderInput={params => <TextField
          {...params}
          error={!!errors.salesCategory}
          helperText={errors.salesCategory?.message || ""}
          label="Sales Category"
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


