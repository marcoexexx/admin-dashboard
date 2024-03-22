import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { object, z } from "zod";

const filterPermissionsSchema = object({});

export type FilterPermissionsInput = z.infer<
  typeof filterPermissionsSchema
>;

export function PermissionsFilterForm() {
  const { dispatch } = useStore();

  const [_filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterPermissionsInput>({
    resolver: zodResolver(filterPermissionsSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FilterPermissionsInput> = (value) => {
    const {} = value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_PERMISSION_FILTER",
      payload: {
        where: {/* TODO: Filter Permisison */},
      },
    });
  };

  const handleOnClickReset = () => {
    setFilterQuery({});

    // TODO: reset form

    dispatch({ type: "SET_PERMISSION_FILTER", payload: {} });
  };

  return (
    <FormProvider {...methods}>
      <Grid
        container
        spacing={1}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            {/* TODO: Form fileds */}
          </Box>
        </Grid>

        <Grid item>
          <MuiButton variant="contained" type="submit">Search</MuiButton>
        </Grid>

        <Grid item>
          <MuiButton
            onClick={handleOnClickReset}
            variant="outlined"
            type="button"
          >
            Reset
          </MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
