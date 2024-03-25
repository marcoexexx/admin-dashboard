import { getFullscreenElement } from "@/libs/getFullscreenElement";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { IconButton, Tooltip } from "@mui/material";

export default function HeaderFullScreen() {
  const handleFullScreen = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    if (getFullscreenElement()) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(console.error);
  };

  return (
    <>
      <Tooltip arrow title="Fullscreen mode">
        <IconButton color="primary" onClick={handleFullScreen}>
          {getFullscreenElement()
            ? <FullscreenExitIcon />
            : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
}
