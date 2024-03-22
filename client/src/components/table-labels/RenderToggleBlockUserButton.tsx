import { useUnblockUser } from "@/hooks/user";
import { useBlockUser } from "@/hooks/user/useBlockUser";
import { User } from "@/services/types";
import { Typography } from "@mui/material";
import { MuiButton } from "../ui";

export function RenderToggleBlockUserButton(
  { user, me }: { user: User; me: User; },
) {
  const blocked = user.blockedUsers.find(u => u.blockedById === me.id);

  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();

  const handleToggleBlock = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (blocked) {
      unblockUserMutation.mutate({ blockedUserId: blocked.userId });
    } else blockUserMutation.mutate({ userId: user.id });
  };

  if (user.id === me.id) return <Typography>Self</Typography>;

  return (
    <MuiButton
      color={blocked ? "primary" : "error"}
      onClick={handleToggleBlock}
      loading={blockUserMutation.isPending}
    >
      {blocked ? "Unblock" : "Block"}
    </MuiButton>
  );
}
