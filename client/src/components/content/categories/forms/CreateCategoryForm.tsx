import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { createCategoryFn } from "@/services/categoryApi";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";

const createCategorySchema = object({
  name: string({ required_error: "Category name is required" })
    .min(1).max(128)
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export function CreateCategoryForm() {
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/categories"

  const {
    mutate: createCategory,
  } = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new category.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new category.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateCategoryInput> = (value) => {
    createCategory(value)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth {...register("name")} label="Name" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}


