import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { Permission } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useGetPermissions } from "@/hooks/permission";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";
import filter from "lodash/filter";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface PermissionMultiInputFieldProps {
  updateField?: boolean;
}

export function PermissionMultiInputField({ updateField = false }: PermissionMultiInputFieldProps) {
  const { control, setValue, getValues } = useFormContext<{ permissions: string[]; }>();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetPermissions({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 100,
    },
  });
  const permissions = try_data.ok()?.results;

  const defaultPermissionIds = getValues("permissions");
  const defaultPermissions = defaultPermissionIds
    ? filter(permissions, (category) => defaultPermissionIds.includes(category.id))
    : [];

  useEffect(() => {
    if (defaultPermissions.length && updateField) setSelectedPermissions(defaultPermissions);
  }, [defaultPermissions.length]);

  const handlePermissionChange = (_: React.SyntheticEvent, value: Permission[] | null) => {
    if (value) {
      setSelectedPermissions(value);
      setValue("permissions", value.map(v => v.id));
    }
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-permission" });
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
            label="Failed category autocomplete"
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
        name="permissions"
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            multiple
            value={selectedPermissions}
            options={permissions || []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={option => `${option.resource}::${option.action}` || ""}
            loading={isLoading}
            renderOption={(props, option) => (
              <li {...props} style={{ display: "block" }}>
                {option.resource}::{option.action}
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
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                label="Permissions"
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
            onChange={handlePermissionChange}
          />
        )}
      />
    </>
  );
}
