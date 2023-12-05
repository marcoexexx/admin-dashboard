import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";
import { deleteSalesCategoryFn } from "@/services/salesCategoryApi";

const deleteSalesCategorySchema = object({
  salesCategoryId: string({ required_error: "Sales category id is required" })
    .min(1).max(128)
})

export type DeleteSalesCategoryInput = z.infer<typeof deleteSalesCategorySchema>


interface DeleteSalesCategoryFormProps {
  salesCategoryId: string
}

export function DeleteSalesCategoryForm(props: DeleteSalesCategoryFormProps) {
  const { salesCategoryId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/sales-categories"

  const {
    mutate: deleteSalesCategory,
  } = useMutation({
    mutationFn: deleteSalesCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a new sales category.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["sales-categories"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete a new sales category.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteSalesCategoryInput>({
    resolver: zodResolver(deleteSalesCategorySchema),
    defaultValues: {
      salesCategoryId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteSalesCategoryInput> = (value) => {
    deleteSalesCategory(value.salesCategoryId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("salesCategoryId")} label="Name" error={!!errors.salesCategoryId} helperText={!!errors.salesCategoryId ? errors.salesCategoryId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

