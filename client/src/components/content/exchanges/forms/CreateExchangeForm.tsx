import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField } from "@/components/input-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, z } from "zod";

import { priceUnit } from '@/components/content/products/forms'
import { useCreateExchange } from "@/hooks/exchange";


const createExchangeSchema = object({
  from: z.enum(priceUnit).default("MMK"),
  to: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any()
}) 

export type CreateExchangeInput = z.infer<typeof createExchangeSchema>

export function CreateExchangeForm() {
  // Mutations
  const createExchangeMuttion = useCreateExchange()

  const methods = useForm<CreateExchangeInput>({
    resolver: zodResolver(createExchangeSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateExchangeInput> = (value) => {
    createExchangeMuttion.mutate({ ...value, date: value.date?.toISOString() })
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
          <MuiButton variant="contained" type="submit" loading={createExchangeMuttion.isPending}>Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

