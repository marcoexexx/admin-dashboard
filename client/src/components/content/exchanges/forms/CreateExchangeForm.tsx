import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { createExchangeFn } from "@/services/exchangesApi";
import { DatePickerField } from "@/components/input-fields";

import { priceUnit } from '@/components/content/products/forms'
import { playSoundEffect } from "@/libs/playSound";


const createExchangeSchema = object({
  from: z.enum(priceUnit).default("MMK"),
  to: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any()
}) 

export type CreateExchangeInput = z.infer<typeof createExchangeSchema>

export function CreateExchangeForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/exchanges"

  const {
    mutate: createExchange,
  } = useMutation({
    mutationFn: createExchangeFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new exchange.",
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

  const methods = useForm<CreateExchangeInput>({
    resolver: zodResolver(createExchangeSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateExchangeInput> = (value) => {
    createExchange({ ...value, date: value.date?.toISOString() })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              {...register("from")} 
              defaultValue={priceUnit[0]}
              label="Price unit from" 
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
              defaultValue={priceUnit[0]}
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
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

