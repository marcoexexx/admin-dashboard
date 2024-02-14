import { User } from "@/services/types";
import { MuiButton } from "../ui";
import { useBlockUser } from "@/hooks/user/useBlockUser";
import { Typography } from "@mui/material";
import { useUnblockUser } from "@/hooks/user";

export function RenderToggleBlockUserButton({user, me}: {user: User, me: User}) {

  const blocked = user.blockedUsers.find(u => u.blockedById === me.id)

  const blockUserMutation = useBlockUser()
  const unblockUserMutation = useUnblockUser()


  const handleToggleBlock = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (blocked) unblockUserMutation.mutate({ blockedUserId: blocked.userId })
    else blockUserMutation.mutate({ userId: user.id })
  }

  if (user.id === me.id) return <Typography>Self</Typography>

  return <MuiButton 
    color={blocked ? "primary" : "error"}
    onClick={handleToggleBlock}
    loading={blockUserMutation.isPending}
  >
    {blocked ? "Unblock" : "Block"}
  </MuiButton>
}


