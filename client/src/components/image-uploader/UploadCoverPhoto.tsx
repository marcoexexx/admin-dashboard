import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { UserApiService } from "@/services/usersApi";
import { Button, styled } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { object, z } from "zod";
import { queryClient } from "..";

import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";

const apiService = UserApiService.new();

const Input = styled("input")({
  display: "none",
});

const uploadCoverPhotoSchema = object({
  image: z.instanceof(FileList),
});

export type UploadCoverPhotoInput = z.infer<typeof uploadCoverPhotoSchema>;

export function UploadCoverPhoto() {
  const { dispatch } = useStore();

  const { mutate: upload } = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.uploadCoverPhoto>) => apiService.uploadCoverPhoto(...args),
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success upload cover photo",
          severity: "success",
        },
      });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.AuthUser, "profile"],
      });
    },
    onError() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "failed upload profile picture",
          severity: "error",
        },
      });
    },
  });

  const handleChangeImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.target;
    if (files) upload({ image: files });
  };

  return (
    <form>
      <Input
        accept="image/*"
        id="change-cover"
        type="file"
        onChange={handleChangeImage}
      />
      <label htmlFor="change-cover">
        <Button
          startIcon={<UploadTwoToneIcon />}
          variant="contained"
          component="span"
        >
          Change cover
        </Button>
      </label>
    </form>
  );
}
