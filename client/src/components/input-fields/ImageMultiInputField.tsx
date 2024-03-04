import { useState } from "react"
import { Autocomplete, AutocompleteInputChangeReason, Avatar, Chip, TextField } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"


interface ImageMultiInputFieldProps { }

export function ImageMultiInputField(props: ImageMultiInputFieldProps) {
  const { } = props
  const { control, /* setValue */ } = useFormContext<{ images: string[] }>()

  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [text, setText] = useState<string>('')

  const handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setText(value)
  }

  const handleOnKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === "," || evt.key === " ") {
      setText("")
      setImages(prev => [...prev, text])
      setSelectedImages(prev => [...prev, text])
      return
    }

    if ((evt.metaKey || evt.ctrlKey) && evt.key === "x") {
      setText("")
      setImages(prev => prev.slice(0, -1))
      setSelectedImages(prev => prev.slice(0, -1))
      return
    }
  }

  const handleOnInputChange = (_event: React.SyntheticEvent, _value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "clear") {
      setText("")
      setImages([])
      setSelectedImages([])
    }
  }


  return <>
    <Controller
      name="images"
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          multiple
          options={images}
          value={selectedImages}
          onInputChange={handleOnInputChange}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={option => option}
          inputValue={text.replace(",", "")}
          renderTags={(values, _props, _owner) => {
            return values.map(value => {
              return <Chip key={value} avatar={<Avatar alt="image" src={value} />} label={value.split(".").slice(-2, -1)[0].slice(0, 30)} />
            })
          }}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option}
            </li>
          )}
          renderInput={params => <TextField
            {...params}
            error={!!fieldState.error}
            helperText={fieldState.error?.message || ""}
            label="Images (separate with spaces and remove with Ctrl + x)"
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {params.InputProps.endAdornment}
              </>
            }}
          />}
        />
      )}
    />
  </>
}
