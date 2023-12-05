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
import { getCategoryFn, updateCategoryFn } from "@/services/categoryApi";

const updateCategorySchema = object({
  name: string()
    .min(0).max(128).optional()
})

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

export function UpdateCategoryForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { categoryId } = useParams()
  const from = "/categories"

  const { 
    data: brand,
    isSuccess: isSuccessFetchCategory,
  } = useQuery({
    enabled: !!categoryId,
    queryKey: ["categories", { id: categoryId }],
    queryFn: args => getCategoryFn(args, { categoryId }),
    select: data => data?.category
  })

  const {
    mutate: updateCategory,
  } = useMutation({
    mutationFn: updateCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a category.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
  })

  useEffect(() => {
    if (isSuccessFetchCategory && brand) methods.setValue("name", brand.name)
  }, [isSuccessFetchCategory])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateCategoryInput> = (value) => {
    if (categoryId) updateCategory({ categoryId, category: value })
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


