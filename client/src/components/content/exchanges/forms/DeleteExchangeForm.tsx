import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";
import { deleteExchangeFn } from "@/services/exchangesApi";

const deleteExchangeSchema = object({
  exchangeId: string({ required_error: "Exchange id is required" })
    .min(1).max(128)
})

export type DeleteExchangeInput = z.infer<typeof deleteExchangeSchema>


interface DeleteExchangeFormProps {
  exchangeId: string
}

export function DeleteExchangeForm(props: DeleteExchangeFormProps) {
  const { exchangeId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/exchanges"

  const {
    mutate: deleteExchange,
  } = useMutation({
    mutationFn: deleteExchangeFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a exchange.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["exchanges"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete exchange.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteExchangeInput>({
    resolver: zodResolver(deleteExchangeSchema),
    defaultValues: {
      exchangeId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteExchangeInput> = (value) => {
    deleteExchange(value.exchangeId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("exchangeId")} label="Exchange" error={!!errors.exchangeId} helperText={!!errors.exchangeId ? errors.exchangeId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

