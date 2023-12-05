import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { getCategoriesFn } from '@/services/categoryApi';
import { useStore } from '@/hooks';
import { MuiButton } from '@/components/ui';
import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))

export function CatgoryMultiInputField() {
  const { control, setValue, formState: { errors } } = useFormContext<{ categories: string[] }>()
  const [ selectedCategories, setSelectedCategories ] = useState<Pick<ICategory, "id" | "name">[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: categories,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["categories"],
    queryFn: args => getCategoriesFn(args, { 
      filter: {},
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      }
    }),
    select: data => data.results
  })

  const handleCategoryChange = (_: React.SyntheticEvent, value: Pick<ICategory, "id" | "name">[] | null) => {
    if (value) {
      setSelectedCategories(value)
      setValue("categories", value.map(v => v.id))
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "categories" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

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

  return <>
    <Controller
      name="categories"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedCategories}
          options={categories || []}
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
              component="label"
              onClick={handleOnClickCreateNew}
            >
              Create new
            </MuiButton>
          </InnerPaper>}
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
          onChange={handleCategoryChange}
        />
      )}
    />
  </>
}

