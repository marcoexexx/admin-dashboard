import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetSalesCategories } from "@/hooks/salsCategory";
import { SalesCategory } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface SalesCategoriesInputFieldProps {
  updateField?: boolean;
}

export function SalesCategoriesInputField({ updateField = false }: SalesCategoriesInputFieldProps) {
  const { control, setValue, getValues, formState: { errors }, watch } = useFormContext<
    { salesCategoryId: string; }
  >();
  const [selectedSaleCategory, setSelectedSaleCategory] = useState<SalesCategory | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetSalesCategories({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 100,
    },
  });
  const sales = try_data.ok()?.results;

  const defaultSalesCategoryId = getValues("salesCategoryId");
  const defaultSalesCategory = defaultSalesCategoryId
    ? sales?.find(sale => sale.id === defaultSalesCategoryId)
    : undefined;

  useEffect(() => {
    if (defaultSalesCategory && updateField) setSelectedSaleCategory(defaultSalesCategory);
  }, [defaultSalesCategory, watch("salesCategoryId")]);

  const handleSaleCategoryChange = (_: React.SyntheticEvent, value: SalesCategory | null) => {
    if (value) {
      setSelectedSaleCategory(value);
      setValue("salesCategoryId", value.id);
    }
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-sales-category" });
  };

  const handleOnCloseOptions = (_: React.SyntheticEvent) =>
    new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200));

  if (isError) {
    return (
      <Autocomplete
        options={[]}
        disabled
        renderInput={params => (
          <TextField
            {...params}
            error={true}
            label="Failed brand autocomplete"
            fullWidth
            helperText={error?.message}
          />
        )}
      />
    );
  }

  return (
    <>
      <Controller
        name="salesCategoryId"
        control={control}
        render={({ field }) => (
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
              <li {...props} style={{ display: "block" }}>
                {option.name}
              </li>
            )}
            PaperComponent={({ children }) => (
              <InnerPaper>
                {children}
                <MuiButton
                  fullWidth
                  startIcon={<AddTwoToneIcon />}
                  variant="outlined"
                  onClick={handleOnClickCreateNew}
                >
                  Create new
                </MuiButton>
              </InnerPaper>
            )}
            renderInput={params => (
              <TextField
                {...params}
                error={!!errors.salesCategoryId}
                helperText={errors.salesCategoryId?.message || ""}
                disabled={updateField}
                label="Sale"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading && <CircularProgress color="primary" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={handleSaleCategoryChange}
          />
        )}
      />
    </>
  );
}
