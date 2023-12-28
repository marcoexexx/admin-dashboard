import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"


const colors = [
  "White",
  "Yellow",
  "Red",
  "Green",
  "Light Green",
  "Deepblue",
  "Midnight Blue",
  "Sea Blue",
  "Sky Blue",
  "Classics Black"
]


export interface ColorsInputFieldProps {
}

export function ColorsInputField(props: ColorsInputFieldProps) {
  const {} = props

  const { control, setValue, formState: { errors } } = useFormContext<{ colors: string[] }>()

  const [ selectedColors, setSelectedColors ] = useState<string[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const handleSalesCateogyChange = (_: React.SyntheticEvent, value: string[] | null) => {
    if (value) {
      setSelectedColors(value)
      setValue("colors", value.map(v => v))
    }
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))


  return <>
    <Controller
      name="colors"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedColors}
          options={colors || []}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={option => option || ""}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option}
            </li>
          )}
          renderInput={params => <TextField
            {...params}
            error={!!errors.colors}
            helperText={errors.colors?.message || ""}
            label="Colors"
          />}
          onChange={handleSalesCateogyChange}
        />
      )}
    />
  </>
}
