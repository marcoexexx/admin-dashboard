import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks';
import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiButton } from '@/components/ui';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { SalesCategory } from '@/services/types';
import { getSalesCategoriesFn } from '@/services/salesCategoryApi';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface SalesCategoriesInputFieldProps {
  updateField?: boolean
}

export function SalesCategoriesInputField({updateField = false}: SalesCategoriesInputFieldProps) {
  const { control, setValue, getValues, formState: { errors }, watch } = useFormContext<{ salesCategoryId: string }>()
  const [ selectedSaleCategory, setSelectedSaleCategory ] = useState<SalesCategory|null>(null)
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: sales,
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

  const defaultSalesCategoryId = getValues("salesCategoryId")
  const defaultSalesCategory = defaultSalesCategoryId
    ? sales?.find(sale => sale.id === defaultSalesCategoryId)
    : undefined

  useEffect(() => {
    if (defaultSalesCategory && updateField) setSelectedSaleCategory(defaultSalesCategory)
  }, [defaultSalesCategory, watch("salesCategoryId")])


  const handleSaleCategoryChange = (_: React.SyntheticEvent, value: SalesCategory | null) => {
    if (value) {
      setSelectedSaleCategory(value)
      setValue("salesCategoryId", value.id)
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
        label="Failed brand autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />


  return <>
    <Controller
      name="salesCategoryId"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          value={selectedSaleCategory}
          options={sales || []}
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
            error={!!errors.salesCategoryId}
            helperText={errors.salesCategoryId?.message || ""}
            disabled={updateField}
            label="Sale"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleSaleCategoryChange}
        />
      )}
    />
  </>
}


