import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetProducts } from "@/hooks/product";
import { Product } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface ProductInputFieldProps {
  updateField?: boolean;
}

export function ProductInputField({ updateField = false }: ProductInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ productId: string; }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetProducts({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 100,
    },
  });
  const products = try_data.ok()?.results;

  const defaultProductId = getValues("productId");
  const defaultProduct = defaultProductId
    ? products?.find(product => product.id === defaultProductId)
    : undefined;

  useEffect(() => {
    if (defaultProduct && updateField) setSelectedProduct(defaultProduct);
  }, [defaultProduct]);

  const handleProductChange = (_: React.SyntheticEvent, value: Product | null) => {
    if (value) {
      setSelectedProduct(value);
      setValue("productId", value.id);
    }
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-product" });
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
            label="Failed product autocomplete"
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
        name="productId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            value={selectedProduct}
            options={products || []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            // TODO: some name are same, so, should not use as key
            getOptionLabel={option => option.id || ""}
            loading={isLoading}
            renderOption={(props, option) => (
              <li {...props} style={{ display: "block" }}>
                {option.title}
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
                error={!!errors.productId}
                helperText={errors.productId?.message || ""}
                label="Product"
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
            onChange={handleProductChange}
          />
        )}
      />
    </>
  );
}
