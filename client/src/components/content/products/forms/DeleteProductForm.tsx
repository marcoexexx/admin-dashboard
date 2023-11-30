import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";
import { deleteProductFn } from "@/services/productsApi";

const deleteProductSchema = object({
  productId: string({ required_error: "Product id is required" })
    .min(1).max(128)
})

export type DeleteProductInput = z.infer<typeof deleteProductSchema>


interface DeleteProductFormProps {
  productId: string
}

export function DeleteProductForm(props: DeleteProductFormProps) {
  const { productId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/products"

  const {
    mutate: deleteProduct,
  } = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a product.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete product.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteProductInput>({
    resolver: zodResolver(deleteProductSchema),
    defaultValues: {
      productId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteProductInput> = (value) => {
    deleteProduct(value.productId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("productId")} label="Product" error={!!errors.productId} helperText={!!errors.productId ? errors.productId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

