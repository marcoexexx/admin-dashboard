import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { object, z } from "zod";

const filterOrderSchema = object({});

export type FilterOrdersInput = z.infer<typeof filterOrderSchema>;

export function OrdersFilterForm() {
  const { dispatch } = useStore();

  const [_filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterOrdersInput>({
    resolver: zodResolver(filterOrderSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FilterOrdersInput> = (value) => {
    const {} = value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_ORDER_FILTER",
      payload: {
        where: {},
      },
    });
  };

  const handleOnClickReset = () => {
    setFilterQuery({});
    dispatch({
      type: "SET_ORDER_FILTER",
      payload: {
        where: undefined,
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item>
          <MuiButton variant="contained" type="submit">Search</MuiButton>
        </Grid>

        <Grid item>
          <MuiButton onClick={handleOnClickReset} variant="outlined" type="button">Reset</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
