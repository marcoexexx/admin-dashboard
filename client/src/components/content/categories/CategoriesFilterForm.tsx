import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { boolean, object, string, z } from "zod";

const filterCategoriesSchema = object({
  name: string().min(0).max(128).optional(),
  insensitive: boolean().optional().default(false),
});

export type FilterCategoriesInput = z.infer<typeof filterCategoriesSchema>;

export function CategoriesFilterForm() {
  const { dispatch } = useStore();

  const [filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterCategoriesInput>({
    resolver: zodResolver(filterCategoriesSchema),
  });

  const { handleSubmit, register, formState: { errors }, setValue } =
    methods;

  const onSubmit: SubmitHandler<FilterCategoriesInput> = (value) => {
    const { name, insensitive } = value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_CATEGORY_FILTER",
      payload: {
        where: {
          name: {
            contains: name || undefined,
            mode: insensitive ? "insensitive" : "default",
          },
        },
      },
    });
  };

  const handleOnClickReset = () => {
    setFilterQuery({});
    setValue("name", undefined);
    setValue("insensitive", false);
    dispatch({
      type: "SET_CATEGORY_FILTER",
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
            <TextField
              fullWidth
              defaultValue={filterQuery.get("name")}
              {...register("name")}
              label="Name"
              error={!!errors.name}
              helperText={!!errors.name ? errors.name.message : ""}
            />
            <FormControlLabel
              {...register("insensitive")}
              label="Insensitive"
              control={
                <Checkbox
                  defaultChecked={filterQuery.get("insensitive")
                    === "true"}
                />
              }
            />
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
