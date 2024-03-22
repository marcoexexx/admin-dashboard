import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetBrands } from "@/hooks/brand";
import { Brand } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface BrandInputFieldProps {
  updateField?: boolean;
}

export function BrandInputField(
  { updateField = false }: BrandInputFieldProps,
) {
  const { control, setValue, getValues, formState: { errors } } =
    useFormContext<
      { brandId: string; }
    >();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetBrands({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 1000,
    },
  });
  const brands = try_data.ok()?.results;

  const defaultBrandId = getValues("brandId");
  const defaultBrand = defaultBrandId
    ? brands?.find(brand => brand.id === defaultBrandId)
    : undefined;

  useEffect(() => {
    if (defaultBrand && updateField) setSelectedBrand(defaultBrand);
  }, [defaultBrand]);

  const handleBrandChange = (
    _: React.SyntheticEvent,
    value: Brand | null,
  ) => {
    if (value) {
      setSelectedBrand(value);
      setValue("brandId", value.id);
    }
  };

  const handleOnClickCreateNew = (
    _: React.MouseEvent<HTMLButtonElement>,
  ) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-brand" });
  };

  const handleOnCloseOptions = (_: React.SyntheticEvent) =>
    new Promise(resolve =>
      setTimeout(() => resolve(setIsOpenOptions(false)), 200)
    );

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
        name="brandId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            value={selectedBrand}
            options={brands || []}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id}
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
                error={!!errors.brandId}
                helperText={errors.brandId?.message || ""}
                label="Brand"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading && (
                        <CircularProgress color="primary" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={handleBrandChange}
          />
        )}
      />
    </>
  );
}
