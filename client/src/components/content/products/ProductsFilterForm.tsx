import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { boolean, number, object, string, z } from "zod";

const filterProductsSchema = object({
  minPrice: number().optional(),
  maxPrice: number().optional(),
  // brand: string()
  //   .min(0).max(128).optional(),
  title: string()
    .min(0).max(128).optional(),
  // specification: string()
  //   .min(0).max(1024).optional(),
  // overview: string()
  //   .min(0).max(1024).optional(),
  // features: string()
  //   .min(0).max(1024).optional(),
  // warranty: number(),
  // // categories: string().array().default([]),
  // colors: string()
  //   .min(0).max(128).optional(),
  // instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]).optional(),
  description: string()
    .min(0).max(1024).optional(),
  status: z.enum(["draft", "pending", "published"]).optional(),
  // type: z.enum(["Switch", "Accessory", "Router", "Wifi"]).optional(),
  // dealerPrice: number().min(0).optional(),
  // marketPrice: number().min(0).optional(),
  // discount: number().min(0),
  // priceUnit: z.enum(["MMK", "USD", "THB", "KRW"]).optional(),
  // // salesCategory: string().array(),
  // quantity: number().min(0),
  insensitive: boolean().default(false),
});

export type FilterProductsInput = z.infer<typeof filterProductsSchema>;

export function ProductdsFilterForm() {
  const { dispatch } = useStore();

  const [filterQuery, setFilterQuery] = useSearchParams();

  const { handleSubmit, register, formState: { errors } } = useForm<FilterProductsInput>({
    resolver: zodResolver(filterProductsSchema),
  });

  const onSubmit: SubmitHandler<FilterProductsInput> = (value) => {
    const {
      title,
      description,
      minPrice,
      maxPrice,
      insensitive,
    } = value;
    setFilterQuery(prev => ({ ...prev, ...value }));
    dispatch({
      type: "SET_PRODUCT_FILTER",
      payload: {
        where: {
          title: {
            contains: title || undefined,
            mode: insensitive ? "insensitive" : "default",
          },
          description: {
            mode: insensitive ? "insensitive" : "default",
            contains: description || undefined,
          },
          price: {
            gte: maxPrice,
            lte: minPrice,
          },
        },
      },
    });
  };

  const handleOnClickReset = () => {
    dispatch({
      type: "SET_PRODUCT_FILTER",
      payload: {
        where: undefined,
      },
    });
  };

  return (
    <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} md={6}>
        <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
          <TextField
            fullWidth
            defaultValue={filterQuery.get("title")}
            {...register("title")}
            label="Title"
            error={!!errors.title}
            helperText={!!errors.title ? errors.title.message : ""}
          />
          <TextField
            fullWidth
            defaultValue={filterQuery.get("description")}
            {...register("description")}
            label="Description"
            error={!!errors.description}
            helperText={!!errors.description ? errors.description.message : ""}
          />
        </Box>
      </Grid>

      <Grid item xs={6} md={3}>
        <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
          <TextField
            fullWidth
            defaultValue={filterQuery.get("minPrice")}
            type="number"
            {...register("minPrice", {
              setValueAs: value => value === "" ? undefined : parseInt(value, 10),
            })}
            label="Minimum price"
            error={!!errors.minPrice}
            helperText={!!errors.minPrice ? errors.minPrice.message : ""}
          />
        </Box>
      </Grid>

      <Grid item xs={6} md={3}>
        <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
          <TextField
            fullWidth
            type="number"
            defaultValue={filterQuery.get("maxPrice")}
            {...register("maxPrice", {
              setValueAs: value => value === "" ? undefined : parseInt(value, 10),
            })}
            label="Maximum price"
            error={!!errors.maxPrice}
            helperText={!!errors.maxPrice ? errors.maxPrice.message : ""}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
          <FormControlLabel
            {...register("insensitive")}
            label="Insensitive"
            control={<Checkbox defaultChecked={filterQuery.get("insensitive") === "true"} />}
          />
        </Box>
      </Grid>

      <Grid item>
        <MuiButton variant="contained" type="submit">Search</MuiButton>
      </Grid>

      <Grid item>
        <MuiButton onClick={handleOnClickReset} variant="outlined" type="button">Reset</MuiButton>
      </Grid>
    </Grid>
  );
}
