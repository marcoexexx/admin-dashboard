import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetPickupAddresses } from "@/hooks/pickupAddress";
import { PickupAddress } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface PickupAddressInputFieldProps {
  updateField?: boolean;
}

export function PickupAddressInputField({ updateField = false }: PickupAddressInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<
    { pickupAddressId: string; }
  >();
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<PickupAddress | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetPickupAddresses({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 1000,
    },
  });
  const addresses = try_data.ok()?.results;

  const defaultPickupAddressId = getValues("pickupAddressId");
  const defaultPickupAddress = defaultPickupAddressId
    ? addresses?.find(address => address.id === defaultPickupAddressId)
    : undefined;

  useEffect(() => {
    if (defaultPickupAddress && updateField) setSelectedPickupAddress(defaultPickupAddress);
  }, [defaultPickupAddress]);

  const handleBrandChange = (_: React.SyntheticEvent, value: PickupAddress | null) => {
    if (value) {
      setSelectedPickupAddress(value);
      setValue("pickupAddressId", value.id);
    }
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-pickup-addresse" });
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
        name="pickupAddressId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            value={selectedPickupAddress}
            options={addresses || []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={option => option.username || ""}
            loading={isLoading}
            renderOption={(props, option) => (
              <li {...props} style={{ display: "block" }}>
                {option.username}
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
                error={!!errors.pickupAddressId}
                helperText={errors.pickupAddressId?.message || ""}
                label="Pickup address"
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
            onChange={handleBrandChange}
          />
        )}
      />
    </>
  );
}
