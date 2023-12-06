import { useStore } from "@/hooks"
import { object, z } from "zod"
import { uploadProfilePictureFn } from "@/services/usersApi"
import { IconButton, styled } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'
import { queryClient } from ".."


const Input = styled("input")({
  display: "none"
})


const uploadProfilePictureSchema = object({
  image: z.instanceof(FileList)
})

export type UploadProfilePictureInput = z.infer<typeof uploadProfilePictureSchema>


export function UploadProfilePicture() {
  const { dispatch } = useStore()

  const { mutate: upload } = useMutation({
    mutationFn: uploadProfilePictureFn,
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success upload profile picture",
        severity: "success"
      } })
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
    },
    onError() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed upload profile picture",
        severity: "error"
      } })
    }
  })

  const handleChangeImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.target
    if (files) upload({ image: files })
  }


  return (
    <form>
      <Input
        accept="image/*"
        id="icon-button-file"
        name="icon-button-file"
        type="file"
        onChange={handleChangeImage}
      />
      <label htmlFor="icon-button-file">
        <IconButton component="span" color="primary">
          <UploadTwoToneIcon />
        </IconButton>
      </label>
    </form>
  )
}
