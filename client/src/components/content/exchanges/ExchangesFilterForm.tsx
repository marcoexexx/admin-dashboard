import { DatePickerField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { PriceUnit } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { number, object, z } from "zod";

const filterExchangesSchema = object({
  from: z.nativeEnum(PriceUnit).optional(),
  to: z.nativeEnum(PriceUnit).optional(),
  rate: number().optional(),
  startDate: z.any(),
  endDate: z.any(),
});

export type FilterExchangesInput = z.infer<typeof filterExchangesSchema>;

export function ExchangesFilterForm() {
  const { dispatch } = useStore();

  const [filterQuery, setFilterQuery] = useSearchParams();

  const methods = useForm<FilterExchangesInput>({
    resolver: zodResolver(filterExchangesSchema),
    defaultValues: {
      startDate: dayjs(filterQuery.get("startDate")),
      endDate: dayjs(filterQuery.get("endDate")),
    },
  });

  const { handleSubmit, register, formState: { errors }, setValue } =
    methods;

  const onSubmit: SubmitHandler<FilterExchangesInput> = (value) => {
    const { to, from, rate, startDate, endDate } = value;

    setFilterQuery(prev => ({ ...prev, ...value }));

    dispatch({
      type: "SET_EXCHANGE_FILTER",
      payload: {
        where: {
          to,
          from,
          rate,
          startDate: (() => {
            try {
              return startDate?.toISOString();
            } catch (_) {
              return undefined;
            }
          })(),
          endDate: (() => {
            try {
              return endDate?.toISOString();
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
    setValue("to", undefined);
    setValue("from", undefined);
    setValue("rate", undefined);
    setValue("startDate", undefined);
    setValue("endDate", undefined);
    dispatch({
      type: "SET_EXCHANGE_FILTER",
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
              {...register("rate", {
                setValueAs: value =>
                  value === "" ? undefined : parseInt(value, 10),
              })}
              defaultValue={filterQuery.get("rate")}
              type="number"
              inputProps={{
                step: "0.01",
              }}
              label="Rate"
              error={!!errors.rate}
              helperText={!!errors.rate ? errors.rate.message : ""}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <TextField
              {...register("from")}
              defaultValue={filterQuery.get("from") || PriceUnit.MMK}
              label="Price unit from"
              error={!!errors.from}
              helperText={!!errors.from ? errors.from.message : ""}
              select
              fullWidth
            >
              {(Object.keys(PriceUnit) as PriceUnit[]).map(t => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register("to")}
              defaultValue={filterQuery.get("to") || PriceUnit.MMK}
              label="Price unit to"
              error={!!errors.to}
              helperText={!!errors.to ? errors.to.message : ""}
              select
              fullWidth
            >
              {(Object.keys(PriceUnit) as PriceUnit[]).map(t => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <DatePickerField fieldName="startDate" />
            <DatePickerField fieldName="endDate" />
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
