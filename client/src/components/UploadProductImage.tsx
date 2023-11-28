import { Controller, useFormContext } from "react-hook-form";

export function UploadProductImage() {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="images"
      render={({field}) => <input 
        {...field}
        type="file"
        accept="image/*"
        multiple
      />}
    />
  )
}
