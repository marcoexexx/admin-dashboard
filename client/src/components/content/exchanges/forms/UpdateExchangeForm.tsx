import dayjs from "dayjs";
import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField } from "@/components/input-fields";
import { getExchangeFn, updateExchangeFn } from "@/services/exchangesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { useEffect } from "react";
import { priceUnit } from "../../products/forms";
import { playSoundEffect } from "@/libs/playSound";


const updateExchangeSchema = object({
  from: z.enum(priceUnit),
  to: z.enum(priceUnit),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any()
}) 

export type UpdateExchangeInput = z.infer<typeof updateExchangeSchema>

export function UpdateExchangeForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { exchangeId } = useParams()
  const from = "/exchanges"

  const { 
    data: exchange,
    isSuccess: isSuccessFetchExchange,
    fetchStatus: fetchStatusExchange
  } = useQuery({
    enabled: !!exchangeId,
    queryKey: ["exchanges", { id: exchangeId }],
    queryFn: args => getExchangeFn(args, { exchangeId }),
    select: data => data?.exchange
  })

  const {
    mutate: updateExchange,
  } = useMutation({
    mutationFn: updateExchangeFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a exchange.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["exchanges"]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const methods = useForm<UpdateExchangeInput>({
    resolver: zodResolver(updateExchangeSchema),
  })

  useEffect(() => {
    if (isSuccessFetchExchange && exchange && fetchStatusExchange === "idle") {
      methods.setValue("date", dayjs(exchange.date))
      methods.setValue("to", exchange.to)
      methods.setValue("from", exchange.from)
      methods.setValue("rate", exchange.rate)
    }
  }, [isSuccessFetchExchange, fetchStatusExchange])

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateExchangeInput> = (value) => {
    if (exchangeId) updateExchange({ exchangeId, exchange: value })
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
          <MuiButton variant="contained" type="submit">Save</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}


