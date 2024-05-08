import { useMe, useStore } from "@/hooks";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { SuspenseLoader } from ".";

import AppError, { AppErrorKind } from "@/libs/exceptions";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { dispatch } = useStore();
  const [cookies] = useCookies(["logged_in"]);

  const meQuery = useMe({
    enabled: !!cookies.logged_in,
    include: {
      cart: true,
    },
  });

  const me = meQuery.try_data.ok_or_throw();
  const { isSuccess, isLoading } = meQuery;

  useEffect(() => {
    if (isSuccess) dispatch({ type: "SET_USER", payload: me });
  }, [isSuccess]);

  const isAllowedReadDashboard = Boolean(
    me?.isSuperuser || me?.shopownerProviderId,
  );

  if (cookies.logged_in && !isAllowedReadDashboard) {
    throw AppError.new(AppErrorKind.PermissionError);
  }

  if (isLoading) return <SuspenseLoader />;

  return children;
}
