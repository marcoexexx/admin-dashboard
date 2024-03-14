import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField, ShopownerInputField } from "@/components/input-fields";
import { PriceUnit } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, z } from "zod";
import { useCreateExchange } from "@/hooks/exchange";
import { useStore } from "@/hooks";
import { useEffect } from "react";


const createExchangeSchema = object({
  from: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
  to: z.nativeEnum(PriceUnit).default(PriceUnit.USD),
  rate: number({ required_error: "rate is required" })
    .min(0),
  date: z.any(),
  shopownerProviderId: z.string({ required_error: "shopownerProviderId is required." })
}).refine(data => data.from !== data.to, {
  path: ["to"],
  message: "to and from must different"
})

export type CreateExchangeInput = z.infer<typeof createExchangeSchema>

export function CreateExchangeForm() {
  const { state: { user } } = useStore()

  const createExchangeMuttion = useCreateExchange()

  const methods = useForm<CreateExchangeInput>({
    resolver: zodResolver(createExchangeSchema)
  })

  const { handleSubmit, register, setValue, formState: { errors } } = methods

  const disabledShopownerField = !user?.isSuperuser || !!user.shopownerProviderId


  useEffect(() => {
    if (user && !user.isSuperuser && user.shopownerProviderId) setValue("shopownerProviderId", user.shopownerProviderId)
  }, [user?.isSuperuser, user?.shopownerProviderId])


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
              defaultValue={PriceUnit.MMK}
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
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <ShopownerInputField updateField disabled={disabledShopownerField} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit" loading={createExchangeMuttion.isPending}>Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

