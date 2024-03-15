import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetTownships } from "@/hooks/township";
import { TownshipFees } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface TownshipByRegionInputFieldProps {
  updateField?: boolean;
}

export function TownshipByRegionInputField({ updateField = false }: TownshipByRegionInputFieldProps) {
  const { control, setValue, getValues, formState: { errors }, watch } = useFormContext<
    { regionId: string; townshipFeesId: string; }
  >();
  const [selectedTownship, setSelectedTownship] = useState<TownshipFees | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const regionId = watch("regionId");

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetTownships({
    filter: {
      // @ts-ignore :: region is probably undefined
      region: {
        id: {
          equals: regionId,
        },
      },
    },
    pagination: {
      page: 1,
      pageSize: 100 * 100,
    },
  });
  const townships = try_data.ok()?.results;

  const defaultTownshipId = getValues("townshipFeesId");
  const defaultTownship = defaultTownshipId
    ? townships?.find(township => township.id === defaultTownshipId)
    : undefined;

  useEffect(() => {
    if (defaultTownship && updateField) setSelectedTownship(defaultTownship);
  }, [defaultTownship]);

  const handleTownshipChange = (_: React.SyntheticEvent, value: TownshipFees | null) => {
    if (value) {
      setSelectedTownship(value);
      setValue("townshipFeesId", value.id);
    }
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-township" });
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
            label="Failed township autocomplete"
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
        disabled={!regionId}
        name="townshipFeesId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            value={selectedTownship}
            options={townships || []}
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
                error={!!errors.regionId}
                helperText={errors.regionId?.message || ""}
                label="Township"
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
            onChange={handleTownshipChange}
          />
        )}
      />
    </>
  );
}
