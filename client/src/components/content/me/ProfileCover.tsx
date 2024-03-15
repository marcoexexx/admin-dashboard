import { UploadCoverPhoto, UploadProfilePicture } from "@/components/image-uploader";
import { MuiButton } from "@/components/ui";
import { User } from "@/services/types";
import { Avatar, Box, Card, CardMedia, IconButton, styled, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";

const AvatarWrapper = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
  display: "inline-block",
  marginTop: `-${theme.spacing(9)}`,
  marginLeft: theme.spacing(2),

  ".MuiAvatar-root": {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

const ButtonUploadWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: theme.spacing(4),
  height: theme.spacing(4),
  bottom: `-${theme.spacing(1)}`,
  right: `-${theme.spacing(1)}`,

  ".MuiIconButton-root": {
    borderRadius: "100%",
    background: theme.colors.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.colors.shadows.primary,
    width: theme.spacing(4),
    height: theme.spacing(4),
    padding: 0,

    "&:hover": {
      background: theme.colors.primary.dark,
    },
  },
}));

const CardCover = styled(Card)(({ theme }) => ({
  position: "relative",

  ".MuiCardMedia-root": {
    height: theme.spacing(26),
  },
}));

const CardCoverAction = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  bottom: theme.spacing(2),
}));

interface ProfileCoverProps {
  user: User;
}

export function ProfileCover({ user }: ProfileCoverProps) {
  const navigate = useNavigate();

  const handleViewAs = () => {
    navigate(`/profile/detail/${user.username}`);
  };

  const profilePicture = user.image || "/profile_pp.png";
  const coverPhoto = user.coverImage || "/outdoor.svg";

  return (
    <>
      <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title="Go back">
          <IconButton color="primary" sx={{ p: 2, mr: 2 }} onClick={() => navigate(-1)}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>

        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            Profile for {user.name}
          </Typography>
          <Typography variant="subtitle2">
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
          </Typography>
        </Box>
      </Box>

      <CardCover>
        <CardMedia image={coverPhoto} />
        <CardCoverAction>
          <UploadCoverPhoto />
        </CardCoverAction>
      </CardCover>

      <AvatarWrapper>
        <Avatar variant="rounded" alt={user.name} src={profilePicture} />
        <ButtonUploadWrapper>
          <UploadProfilePicture />
        </ButtonUploadWrapper>
      </AvatarWrapper>

      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {user.name}
        </Typography>
        <Typography variant="subtitle2">
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem
          pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud
          nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem
          duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt
          duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris
          sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
        </Typography>
        <Typography sx={{ py: 2 }} variant="subtitle2" color="text.primary">
          {/* {user.jobtitle} | {user.location} | {user.followers} followers */}
          title location followers
        </Typography>
        <Box
          display={{ xs: "block", md: "flex" }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <MuiButton size="small" variant="contained">
              Edit
            </MuiButton>
            <MuiButton size="small" sx={{ mx: 1 }} variant="outlined" onClick={handleViewAs}>
              View as
            </MuiButton>
            {/* <IconButton color="primary" sx={{ p: 0.5 }}> */}
            {/*   <MoreHorizTwoToneIcon /> */}
            {/* </IconButton> */}
          </Box>

          {/* <MuiButton */}
          {/*   sx={{ mt: { xs: 2, md: 0 } }} */}
          {/*   size="small" */}
          {/*   variant="text" */}
          {/*   endIcon={<ArrowForwardTwoToneIcon />} */}
          {/* > */}
          {/*   See all 12 connections */}
          {/* </MuiButton> */}
        </Box>
      </Box>
    </>
  );
}
