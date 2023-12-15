import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getSalesCategoriesFn } from '@/services/salesCategoryApi';
import { useStore } from '@/hooks';
import { MuiButton } from '@/components/ui';
import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import filter from 'lodash/filter';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface SalesCategoryMultiInputFieldProps {
  updateField?: boolean
}

export function SalesCategoryMultiInputField({updateField}: SalesCategoryMultiInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ salesCategory: string[] }>()
  const [ selectedCategories, setSelectedCategories ] = useState<Pick<ISalesCategory, "id" | "name">[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: salesCategory,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["sales-categories"],
    queryFn: args => getSalesCategoriesFn(args, { 
      filter: {},
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      }
    }),
    select: data => data.results
  })

  const defaultSalesCategoryIds = getValues("salesCategory")
  const defaultSalesCategories = defaultSalesCategoryIds 
    ? filter(salesCategory, (category) => defaultSalesCategoryIds.includes(category.id))
    : []

  useEffect(() => {
    if (defaultSalesCategories.length && updateField) setSelectedCategories(defaultSalesCategories)
  }, [defaultSalesCategories.length])


  const handleSalesCateogyChange = (_: React.SyntheticEvent, value: Pick<ISalesCategory, "id" | "name">[] | null) => {
    if (value) {
      setSelectedCategories(value)
      setValue("salesCategory", value.map(v => v.id))
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "sales-categories" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

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

  return <>
    <Controller
      name="salesCategory"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedCategories}
          options={salesCategory || []}
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
          onChange={handleSalesCateogyChange}
        />
      )}
    />
  </>
}


