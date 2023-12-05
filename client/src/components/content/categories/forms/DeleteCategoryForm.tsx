import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";
import { deleteCategoryFn } from "@/services/categoryApi";

const deleteCategorySchema = object({
  categoryId: string({ required_error: "Category id is required" })
    .min(1).max(128)
})

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>


interface DeleteCategoryFormProps {
  categoryId: string
}

export function DeleteCategoryForm(props: DeleteCategoryFormProps) {
  const { categoryId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/categories"

  const {
    mutate: deleteCategory,
  } = useMutation({
    mutationFn: deleteCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a category",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete category.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteCategoryInput>({
    resolver: zodResolver(deleteCategorySchema),
    defaultValues: {
      categoryId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteCategoryInput> = (value) => {
    deleteCategory(value.categoryId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("categoryId")} label="Name" error={!!errors.categoryId} helperText={!!errors.categoryId ? errors.categoryId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

