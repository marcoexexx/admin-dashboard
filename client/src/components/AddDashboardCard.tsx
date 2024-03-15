import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { Avatar, Card, CardActionArea, CardContent, styled, Tooltip } from "@mui/material";

const CardAddAction = styled(Card)(({ theme }) => ({
  border: `${theme.colors.primary.main} dashed 1px`,
  height: "100%",
  color: theme.colors.primary.main,
  transition: theme.transitions.create(["all"]),

  ".MuiCardActionArea-root": {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },

  ".MuiTouchRipple-root": {
    opacity: .2,
  },

  "&:hover": {
    borderColor: theme.colors.alpha.black[70],
  },
}));

const AvatarAddWrapper = styled(Avatar)(({ theme }) => ({
  background: theme.colors.alpha.black[10],
  color: theme.colors.primary.main,
  width: theme.spacing(8),
  height: theme.spacing(8),
}));

interface AddDashboardCardProps {
  onClickAdd: () => void;
}

export function AddDashboardCard(props: AddDashboardCardProps) {
  const { onClickAdd } = props;

  return (
    <Tooltip arrow title="Click to add new" onClick={onClickAdd}>
      <CardAddAction>
        <CardActionArea sx={{ px: 1 }}>
          <CardContent>
            <AvatarAddWrapper>
              <AddTwoToneIcon fontSize="large" />
            </AvatarAddWrapper>
          </CardContent>
        </CardActionArea>
      </CardAddAction>
    </Tooltip>
  );
}
