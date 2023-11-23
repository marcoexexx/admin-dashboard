import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { getCategoriesFn } from '@/services/categoryApi';

export function CatgoryMultiInputField() {
  const { control, setValue, formState: { errors } } = useFormContext<{ categories: string[] }>()
  const [ selectedCategories, setSelectedCategories ] = useState<Pick<ICategory, "id" | "name">[]>([])

  const {
    data: categories,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["categories"],
    queryFn: args => getCategoriesFn(args, { filter: {} }),
    select: data => data.results
  })

  const handleBrandChange = (_: React.SyntheticEvent, value: Pick<ICategory, "id" | "name">[] | null) => {
    if (value) {
      setSelectedCategories(value)
      setValue("categories", value.map(v => v.id))
    }
  }

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed category autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />

  return <Controller
    name="categories"
    control={control}
    render={({field}) => (
      <Autocomplete
        {...field}
        multiple
        value={selectedCategories}
        options={categories || []}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name || ""}
        loading={isLoading}
        renderInput={params => <TextField
          {...params}
          error={!!errors.categories}
          helperText={errors.categories?.message || ""}
          label="Categories"
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

