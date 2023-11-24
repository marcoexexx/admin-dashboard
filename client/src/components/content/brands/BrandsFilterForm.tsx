import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { object, string, z } from "zod";


const filterBrandsSchema = object({
  name: string().min(0).max(128).optional()
})

export type FilterBrandsInput = z.infer<typeof filterBrandsSchema>

export function BrandsFilterForm() {
  const { dispatch } = useStore()

  const [filterQuery, setFilterQuery] = useSearchParams()

  const { handleSubmit, register, formState: { errors }, setValue } = useForm<FilterBrandsInput>({
    resolver: zodResolver(filterBrandsSchema)
  })

  const onSubmit: SubmitHandler<FilterBrandsInput> = (value) => {
    const { name } = value
    setFilterQuery(prev => ({ ...prev, ...value }))
    dispatch({ type: "SET_BRAND_FILTER", payload: {
      fields: {
        name: {
          contains: name || undefined
        }
      }
    } })
  }

  const handleOnClickReset = () => {
    setFilterQuery({})
    setValue("name", undefined)
    dispatch({ type: "SET_BRAND_FILTER", payload: {
      fields: undefined
    } })
  }

  return <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
    <Grid item xs={12}>
      <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
        <TextField fullWidth defaultValue={filterQuery.get("name")} {...register("name")} label="Name" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
      </Box>
    </Grid>

    <Grid item>
      <MuiButton variant="contained" type="submit">Search</MuiButton>
    </Grid>

    <Grid item>
      <MuiButton onClick={handleOnClickReset} variant="outlined" type="button">Reset</MuiButton>
    </Grid>
  </Grid>
}
