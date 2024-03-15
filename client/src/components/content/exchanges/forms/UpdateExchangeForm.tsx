import { DatePickerField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useGetExchange, useUpdateExchange } from "@/hooks/exchange";
import { PriceUnit } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { number, object, z } from "zod";

const updateExchangeSchema = object({
  from: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
  to: z.nativeEnum(PriceUnit).default(PriceUnit.USD),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any(),
  shopownerProviderId: z.string({ required_error: "shopownerProviderId is required." }),
}).refine(data => data.from !== data.to, {
  path: ["to"],
  message: "to and from must different",
});
export type UpdateExchangeInput = z.infer<typeof updateExchangeSchema>;

export function UpdateExchangeForm() {
  const { exchangeId } = useParams();

  // Queries
  const exchangeQuery = useGetExchange({
    id: exchangeId,
  });

  // Mutations
  const updateExchangeMutation = useUpdateExchange();

  // Extraction
  const exchange = exchangeQuery.try_data.ok_or_throw();
  const exchangeFetchStatus = exchangeQuery.fetchStatus;

  const methods = useForm<UpdateExchangeInput>({
    resolver: zodResolver(updateExchangeSchema),
  });

  useEffect(() => {
    if (exchangeQuery.isSuccess && exchange && exchangeFetchStatus === "idle") {
      methods.setValue("date", dayjs(exchange.date));
      methods.setValue("to", exchange.to);
      methods.setValue("from", exchange.from);
      methods.setValue("rate", exchange.rate);
    }
  }, [exchangeQuery.isSuccess, exchangeFetchStatus]);

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<UpdateExchangeInput> = (value) => {
    if (exchangeId) updateExchangeMutation.mutate({ id: exchangeId, payload: value });
  };

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <TextField
              {...register("from")}
              label="Price unit from"
              defaultValue={PriceUnit.MMK}
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
            {/* <SelectInputField fieldName="from" options={(Object.keys(PriceUnit) as PriceUnit[])} /> */}
            <TextField
              focused
              fullWidth
              {...register("rate", {
                valueAsNumber: true,
              })}
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
              {...register("to")}
              defaultValue={PriceUnit.MMK}
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
            <DatePickerField required fieldName="date" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit" loading={updateExchangeMutation.isPending}>Save</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
