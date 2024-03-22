import { DatePickerField } from "@/components/input-fields";
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
import dayjs from "dayjs";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { boolean, number, object, z } from "zod";

const filterCouponsSchema = object({
  minPoint: number().optional(),
  maxPoint: number().optional(),
  minDolla: number().optional(),
  maxDolla: number().optional(),
  isUsed: boolean().default(false),
  expiredDate: z.any(),
});

export type FilterCouponsInput = z.infer<typeof filterCouponsSchema>;

export function CouponsFilterForm() {
  const { dispatch } = useStore();

  const [filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterCouponsInput>({
    resolver: zodResolver(filterCouponsSchema),
    defaultValues: {
      expiredDate: dayjs(filterQuery.get("startDate")),
    },
  });

  const { handleSubmit, register, formState: { errors }, setValue } =
    methods;

  const onSubmit: SubmitHandler<FilterCouponsInput> = (value) => {
    const { minPoint, maxPoint, minDolla, maxDolla, isUsed, expiredDate } =
      value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_COUPON_FILTER",
      payload: {
        where: {
          points: {
            gte: minPoint,
            lte: maxPoint,
          },
          dolla: {
            gte: minDolla,
            lte: maxDolla,
          },
          isUsed,
          expiredDate: (() => {
            try {
              return expiredDate?.toISOString();
            } catch (_) {
              return undefined;
            }
          })(),
        },
      },
    });
  };

  const handleOnClickReset = () => {
    setFilterQuery({});

    setValue("minPoint", undefined);
    setValue("maxPoint", undefined);
    setValue("minDolla", undefined);
    setValue("maxDolla", undefined);
    setValue("isUsed", false);
    setValue("expiredDate", undefined);

    dispatch({
      type: "SET_COUPON_FILTER",
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
        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <TextField
              fullWidth
              {...register("minPoint", {
                setValueAs: value =>
                  value === "" ? undefined : parseInt(value, 10),
              })}
              defaultValue={filterQuery.get("minPoint")}
              type="number"
              inputProps={{
                step: "0.01",
              }}
              label="Minium points"
              error={!!errors.minPoint}
              helperText={!!errors.minPoint ? errors.minPoint.message : ""}
            />
            <TextField
              {...register("minDolla", {
                setValueAs: value =>
                  value === "" ? undefined : parseInt(value, 10),
              })}
              defaultValue={filterQuery.get("minDolla")}
              type="number"
              label="Minium dolla"
              error={!!errors.minDolla}
              helperText={!!errors.minDolla ? errors.minDolla.message : ""}
              fullWidth
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <TextField
              {...register("maxPoint", {
                setValueAs: value =>
                  value === "" ? undefined : parseInt(value, 10),
              })}
              defaultValue={filterQuery.get("maxPoint")}
              type="number"
              label="Maxium points"
              error={!!errors.maxPoint}
              helperText={!!errors.maxPoint ? errors.maxPoint.message : ""}
              fullWidth
            />
            <TextField
              {...register("maxDolla", {
                setValueAs: value =>
                  value === "" ? undefined : parseInt(value, 10),
              })}
              defaultValue={filterQuery.get("maxDolla")}
              type="number"
              label="Maxium dolla"
              error={!!errors.minDolla}
              helperText={!!errors.minDolla ? errors.minDolla.message : ""}
              fullWidth
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <DatePickerField fieldName="expiredDate" />
            <FormControlLabel
              {...register("isUsed")}
              label="Used"
              control={
                <Checkbox
                  defaultChecked={filterQuery.get("isUsed") === "true"}
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
