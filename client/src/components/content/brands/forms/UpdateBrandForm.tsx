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
import { getBrandFn, updateBrandFn } from "@/services/brandsApi";

const updateBrandSchema = object({
  name: string()
    .min(0).max(128).optional()
})

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>

export function UpdateBrandForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { brandId } = useParams()
  const from = "/brands"

  const { 
    data: brand,
    isSuccess: isSuccessFetchBrand,
  } = useQuery({
    enabled: !!brandId,
    queryKey: ["brands", { id: brandId }],
    queryFn: args => getBrandFn(args, { brandId }),
    select: data => data?.brand
  })

  const {
    mutate: updateBrand,
  } = useMutation({
    mutationFn: updateBrandFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a brand.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["brands"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<UpdateBrandInput>({
    resolver: zodResolver(updateBrandSchema),
  })

  useEffect(() => {
    if (isSuccessFetchBrand && brand) methods.setValue("name", brand.name)
  }, [isSuccessFetchBrand])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateBrandInput> = (value) => {
    if (brandId) updateBrand({ brandId, brand: value })
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


