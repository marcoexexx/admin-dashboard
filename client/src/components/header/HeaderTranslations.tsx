import { useStore } from "@/hooks";
import { Local, localString } from "@/i18n";
import { getUnicodeFlags } from "@/libs/getUnicodeFlags";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function HeaderTranslations() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state: { local }, dispatch } = useStore();

  const handleChangeLanguage = (
    evt: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(evt.currentTarget);
  };

  const handleOnChange = (local: Local) => () => {
    dispatch({ type: "SET_LOCAL", payload: local });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleChangeLanguage}>
        {getUnicodeFlags(local)}
      </IconButton>

      <Menu
        onClose={() => setAnchorEl(null)}
        id="translations"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        MenuListProps={{
          "aria-labelledby": "translations flags",
        }}
      >
        {(Object.keys(Local) as Local[]).map(local => (
          <MenuItem key={local} onClick={handleOnChange(local)}>
            <ListItemIcon>
              {getUnicodeFlags(local)}
            </ListItemIcon>
            <ListItemText>{localString[local]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
