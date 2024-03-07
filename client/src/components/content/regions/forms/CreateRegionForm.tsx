import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormModal } from "@/components/forms";
import { TownshipMultiInputField } from "@/components/input-fields";
import { CreateTownshipForm } from "../../townships/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useStore } from "@/hooks";
import { useEffect } from "react";
import { useCreateRegion } from "@/hooks/region";


const createRegionSchema = object({
  name: string({ required_error: "Region name is required" })
    .min(1).max(128),
  townships: string().array().default([])
})

export type CreateRegionInput = z.infer<typeof createRegionSchema>

export function CreateRegionForm() {
  const { state: { modalForm } } = useStore()

  const { mutate: createRegion, isPending } = useCreateRegion()

  const methods = useForm<CreateRegionInput>({
    resolver: zodResolver(createRegionSchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateRegionInput> = (value) => {
    createRegion(value)
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
              <TownshipMultiInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" loading={isPending} type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-township"
        ? <FormModal field="create-township" title='Create new township'>
          <CreateTownshipForm />
        </FormModal>
        : null}
    </>
  )
}

