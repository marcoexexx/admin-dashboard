import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetRoles } from "@/hooks/role";
import { Role } from "@/services/types";
import { Autocomplete, Paper, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

const InnerPaper = styled(Paper)(() => ({
  padding: "10px",
}));

interface RoleInputFieldProps {
  updateField?: boolean;
}

export function RoleInputField({ updateField = false }: RoleInputFieldProps) {
  const { control, setValue, getValues } = useFormContext<{ roleId: string | null; }>();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const { dispatch } = useStore();

  const {
    try_data,
    isLoading,
    isError,
    error,
  } = useGetRoles({
    filter: {},
    pagination: {
      page: 1,
      pageSize: 100 * 1000,
    },
  });
  const roles = try_data.ok()?.results;

  const defaultRoleId = getValues("roleId");
  const defaultRole = defaultRoleId
    ? roles?.find(role => role.id === defaultRoleId)
    : undefined;

  useEffect(() => {
    if (defaultRole && updateField) setSelectedRole(defaultRole);
  }, [defaultRole]);

  const handleRoleChange = (_: React.SyntheticEvent, value: Role | null) => {
    setSelectedRole(value);
    if (value !== null) setValue("roleId", value.id);
    else setValue("roleId", null);
  };

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "create-role" });
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
            label="Failed role autocomplete"
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
        name="roleId"
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            open={isOpenOptions}
            onOpen={() => setIsOpenOptions(true)}
            onClose={handleOnCloseOptions}
            value={selectedRole}
            options={roles || []}
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
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                label="Role"
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
            onChange={handleRoleChange}
          />
        )}
      />
    </>
  );
}
