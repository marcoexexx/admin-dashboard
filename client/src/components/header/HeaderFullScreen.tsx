import { getFullscreenElement } from "@/libs/getFullscreenElement";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export default function HeaderFullScreen() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFullScreen = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    if (getFullscreenElement()) {
      document.exitFullscreen();
      setIsOpen(prev => !prev);
    } else {
      document.documentElement.requestFullscreen().catch(
        console.error,
      );
      setIsOpen(prev => !prev);
    }
  };

  return (
    <>
      <Tooltip
        arrow
        title={isOpen ? "Exit Fullscreen Mode" : "Fullscreen Mode"}
      >
        <IconButton color="primary" onClick={handleFullScreen}>
          {isOpen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
}
