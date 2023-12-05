import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { getSalesCategoryFn, updateSalesCategoryFn } from "@/services/salesCategoryApi";

const updateSalesCategorySchema = object({
  name: string()
    .min(0).max(128).optional()
})

export type UpdateSalesCategoryInput = z.infer<typeof updateSalesCategorySchema>

export function UpdateSalesCategoryForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { salesCategoryId } = useParams()
  const from = "/sales-categories"

  const { 
    data: brand,
    isSuccess: isSuccessFetchSalesCategory,
  } = useQuery({
    enabled: !!salesCategoryId,
    queryKey: ["sales-categories", { id: salesCategoryId }],
    queryFn: args => getSalesCategoryFn(args, { salesCategoryId }),
    select: data => data?.category
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
        severity: "error"
      } })
    },
  })

  const methods = useForm<UpdateSalesCategoryInput>({
    resolver: zodResolver(updateSalesCategorySchema),
  })

  useEffect(() => {
    if (isSuccessFetchSalesCategory && brand) methods.setValue("name", brand.name)
  }, [isSuccessFetchSalesCategory])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateSalesCategoryInput> = (value) => {
    if (salesCategoryId) updateSalesCategory({ salesCategoryId, salesCategory: value })
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
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}


