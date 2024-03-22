import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { object, z } from "zod";

const filterShopownersSchema = object({});

export type FilterShopownersInput = z.infer<typeof filterShopownersSchema>;

export function ShopownersFilterForm() {
  const { dispatch } = useStore();

  const [_filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterShopownersInput>({
    resolver: zodResolver(filterShopownersSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FilterShopownersInput> = (value) => {
    const {} = value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_SHOPOWNER_FILTER",
      payload: {
        where: {},
      },
    });
  };

  const handleOnClickReset = () => {
    setFilterQuery({});

    // TODO: Filter fields

    dispatch({
      type: "SET_SHOPOWNER_FILTER",
      payload: {
        where: undefined,
      },
    });
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
            {/* TOOD: Filter filelds */}
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
