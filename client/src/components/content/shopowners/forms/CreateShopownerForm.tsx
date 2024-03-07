import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { EditorInputField } from "@/components/input-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useEffect } from "react";
import { useCreateShopowner } from "@/hooks/shopowner";


const createShopownerSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1).max(128),
  remark: string({ required_error: "Remark is required" })
    .max(5000).optional()
})

export type CreateShopownerInput = z.infer<typeof createShopownerSchema>

export function CreateShopownerForm() {
  const createShopownerMutation = useCreateShopowner()

  const methods = useForm<CreateShopownerInput>({
    resolver: zodResolver(createShopownerSchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateShopownerInput> = (value) => {
    createShopownerMutation.mutate(value)
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("name")} 
                label="Name" 
                error={!!errors.name} 
                helperText={!!errors.name ? errors.name.message : ""} 
              />
              <EditorInputField fieldName="remark" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={createShopownerMutation.isPending}>Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}

