import dayjs from "dayjs";
import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField, EditorInputField } from "@/components/input-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { useEffect } from "react";
import { getSalesCategoryFn, updateSalesCategoryFn } from "@/services/salesCategoryApi";


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
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { salesCategoryId } = useParams()
  const from = "/sales-categories"

  const { 
    data: salesCategory,
    isSuccess: isSuccessFetchSalesCategory,
    fetchStatus: fetchStatusSalesCategory
  } = useQuery({
    enabled: !!salesCategoryId,
    queryKey: ["sales-categories", { id: salesCategoryId }],
    queryFn: args => getSalesCategoryFn(args, { salesCategoryId }),
    select: data => data?.salesCategory
  })

  const {
    mutate: updateSalesCategory,
  } = useMutation({
    mutationFn: updateSalesCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a sales catgory.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["sales-categories"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error" } })
    },
  })

  const methods = useForm<UpdateSalesCategoryInput>({
    resolver: zodResolver(updateSalesCategorySchema),
  })

  useEffect(() => {
    if (isSuccessFetchSalesCategory && salesCategory && fetchStatusSalesCategory === "idle") {
      for (const field of toUpdateFields) {
        if (field === "startDate" || field === "endDate") methods.setValue(field, dayjs(salesCategory[field]))
        else if (field === "description" && !salesCategory.description) methods.setValue("description", undefined)
        else methods.setValue(field, salesCategory[field])
      }
    }
  }, [isSuccessFetchSalesCategory, fetchStatusSalesCategory])


  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateSalesCategoryInput> = (value) => {
    if (salesCategoryId) updateSalesCategory({ salesCategoryId, salesCategory: value })
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


