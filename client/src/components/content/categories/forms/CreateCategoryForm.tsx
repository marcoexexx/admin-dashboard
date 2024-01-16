import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { createCategoryFn } from "@/services/categoryApi";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { playSoundEffect } from "@/libs/playSound";

const createCategorySchema = object({
  name: string({ required_error: "Category name is required" })
    .min(1).max(128)
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export function CreateCategoryForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/categories"

  const {
    mutate: createCategory,
  } = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new category.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
      playSoundEffect("success")
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new category.",
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const methods = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

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


