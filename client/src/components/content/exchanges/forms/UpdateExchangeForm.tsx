import dayjs from "dayjs";
import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField } from "@/components/input-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { priceUnit } from "../../products/forms";
import { useGetExchange, useUpdateExchange } from "@/hooks/exchange";


const updateExchangeSchema = object({
  from: z.enum(priceUnit),
  to: z.enum(priceUnit),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any()
}) 

export type UpdateExchangeInput = z.infer<typeof updateExchangeSchema>

export function UpdateExchangeForm() {
  const { exchangeId } = useParams()

  // Queries
  const exchangeQuery = useGetExchange({
    id: exchangeId,
  })

  // Mutations
  const updateExchangeMutation = useUpdateExchange()

  // Extraction
  const exchange = exchangeQuery.try_data.ok_or_throw()
  const exchangeFetchStatus = exchangeQuery.fetchStatus

  const methods = useForm<UpdateExchangeInput>({
    resolver: zodResolver(updateExchangeSchema),
  })

  useEffect(() => {
    if (exchangeQuery.isSuccess && exchange && exchangeFetchStatus === "idle") {
      methods.setValue("date", dayjs(exchange.date))
      methods.setValue("to", exchange.to)
      methods.setValue("from", exchange.from)
      methods.setValue("rate", exchange.rate)
    }
  }, [exchangeQuery.isSuccess, exchangeFetchStatus])

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateExchangeInput> = (value) => {
    if (exchangeId) updateExchangeMutation.mutate({ exchangeId, exchange: value })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              {...register("from")} 
              label="Price unit from" 
              defaultValue={priceUnit[0]}
              error={!!errors.from} 
              helperText={!!errors.from ? errors.from.message : ""} 
              select
              fullWidth
            >
              {priceUnit.map(t => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField 
              focused
              fullWidth 
              {...register("rate", {
                valueAsNumber: true
              })} 
              type="number"
              inputProps={{
                step: "0.01"
              }}
              label="Rate" 
              error={!!errors.rate} 
              helperText={!!errors.rate ? errors.rate.message : ""} 
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              {...register("to")} 
              defaultValue={priceUnit[1]}
              label="Price unit to" 
              error={!!errors.to} 
              helperText={!!errors.to ? errors.to.message : ""} 
              select
              fullWidth
            >
              {priceUnit.map(t => (
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
  )
}


