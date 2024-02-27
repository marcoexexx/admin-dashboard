import { MuiButton } from "@/components/ui";
import { Grid } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { object, z } from "zod";


const filterPotentialOrdersSchema = object({
})

export type FilterPotentialOrdersInput = z.infer<typeof filterPotentialOrdersSchema>

export function PotentialOrdersFilterForm() {
  const { dispatch } = useStore()

  const [_filterQuery, setFilterQuery] = useSearchParams()

  const methods = useForm<FilterPotentialOrdersInput>({
    resolver: zodResolver(filterPotentialOrdersSchema)
  })

  const { handleSubmit } = methods

  const onSubmit: SubmitHandler<FilterPotentialOrdersInput> = (value) => {
    const { } = value

    setFilterQuery(prev => ({ ...prev, ...value }))

    dispatch({
      type: "SET_BRAND_FILTER", payload: {
        where: {
        },
      }
    })
  }

  const handleOnClickReset = () => {
    setFilterQuery({})
    dispatch({
      type: "SET_BRAND_FILTER", payload: {
        where: undefined
      }
    })
  }

  return <FormProvider {...methods}>
    <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid item>
        <MuiButton variant="contained" type="submit">Search</MuiButton>
      </Grid>

      <Grid item>
        <MuiButton onClick={handleOnClickReset} variant="outlined" type="button">Reset</MuiButton>
      </Grid>
    </Grid>
  </FormProvider>
}
