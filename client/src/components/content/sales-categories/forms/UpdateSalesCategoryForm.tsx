import dayjs from "dayjs";

import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField, EditorInputField } from "@/components/input-fields";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, object, string, z } from "zod";
import { useEffect } from "react";
import { useGetSalesCategory, useUpdateSalesCategory } from "@/hooks/salsCategory";


const updateSalesCategorySchema = object({
  name: string({ required_error: "Sales category name is required" })
    .min(1).max(128),
  startDate: z.any(),
  endDate: z.any(),
  isActive: boolean().default(true),
  description: string().optional(),
})

export type UpdateSalesCategoryInput = z.infer<typeof updateSalesCategorySchema>

const toUpdateFields: (keyof UpdateSalesCategoryInput)[] = [
  "name",
  "startDate", "endDate",
  "description"
]


export function UpdateSalesCategoryForm() {
  const { salesCategoryId } = useParams()

  const { try_data, isSuccess, fetchStatus } = useGetSalesCategory({ id: salesCategoryId })
  const { mutate: updateSalesCategory } = useUpdateSalesCategory()

  const salesCategory = try_data.ok_or_throw()


  const methods = useForm<UpdateSalesCategoryInput>({
    resolver: zodResolver(updateSalesCategorySchema),
  })

  useEffect(() => {
    if (isSuccess && salesCategory && fetchStatus === "idle") {
      for (const field of toUpdateFields) {
        if (field === "startDate" || field === "endDate") methods.setValue(field, dayjs(salesCategory[field]))
        else if (field === "description" && !salesCategory.description) methods.setValue("description", undefined)
        else methods.setValue(field, salesCategory[field])
      }
    }
  }, [isSuccess, fetchStatus])


  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateSalesCategoryInput> = (value) => {
    if (salesCategoryId) updateSalesCategory({ id: salesCategoryId, payload: value })
  }


  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth {...register("name")} label="Name" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <DatePickerField fieldName="endDate" required />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <DatePickerField fieldName="startDate" required />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <EditorInputField fieldName="description" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}


